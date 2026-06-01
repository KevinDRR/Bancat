from pathlib import Path
import re
from typing import Annotated, Literal, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
import json
import numpy as np
from pydantic import BaseModel, Field, TypeAdapter, field_validator, model_validator
import torch
import torch.nn as nn

from db import (
    ClienteDB,
    ProductoBancarioDB,
    cliente_db_a_dict,
    get_db,
    init_db,
    producto_db_a_dict,
    producto_dict_a_db,
    reindexar_clientes,
)

BASE_DIR = Path(__file__).resolve().parent
CORREO_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAX_DEBT_TO_INCOME_RATIO = 60

app = FastAPI(title="Banco Gatuno", description="El banco de los gatitos")

# Auth de demo: solo afecta visibilidad del enlace "Modelo" en el navbar.
# Los endpoints quedan abiertos a proposito (proyecto academico, lo expone solo el autor).
SESSION_SECRET = "bancat-demo-secret-not-for-production"
ADMIN_USUARIO = "admin"
ADMIN_PASSWORD = "admin123"
SESSION_MAX_AGE = 60 * 60 * 24 * 7  # 7 dias

app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET, max_age=SESSION_MAX_AGE)

# Crea las tablas de SQLite si no existen (idempotente).
init_db()

# Frontend SPA (SvelteKit build estático). Si no existe el build, las rutas
# de página no estarán disponibles pero los endpoints /api/* siguen sirviendo.
FRONTEND_BUILD = BASE_DIR / "frontend" / "build"

# --- Modelo de ML ---

class RedNeuronalRiesgo(nn.Module):
    def __init__(self, n_features: int = 10):
        super().__init__()
        self.red = nn.Sequential(
            nn.Linear(n_features, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Dropout(0.2),

            nn.Linear(32, 16),
            nn.ReLU(),

            nn.Linear(16, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.red(x)


N_FEATURES = 10

modelo_ml = RedNeuronalRiesgo(n_features=N_FEATURES)
modelo_ml.load_state_dict(torch.load(BASE_DIR / "modelo" / "modelo_riesgo.pth", weights_only=True))
modelo_ml.eval()

with open(BASE_DIR / "modelo" / "normalizacion.json") as f:
    stats = json.load(f)
media = np.array(stats["media"])
desviacion = np.array(stats["desviacion"])
NOMBRES_FEATURES = stats.get("nombres_features", [
    "edad", "ingresos", "estado_civil",
    "deudas_existentes", "relacion_deuda_ingreso", "saldo_cuentas",
    "historial_pagos", "tiempo_empleo", "tipo_empleo", "patrimonio",
])

# SHAP explainer (carga perezosa para no bloquear el arranque)
_shap_explainer = None
_shap_disponible = True

try:
    import shap  # type: ignore

    _shap_background = torch.load(BASE_DIR / "modelo" / "background_shap.pt", weights_only=True)
except Exception:
    _shap_disponible = False
    _shap_background = None


def _obtener_explainer():
    global _shap_explainer
    if not _shap_disponible:
        return None
    if _shap_explainer is None:
        try:
            _shap_explainer = shap.DeepExplainer(modelo_ml, _shap_background)
        except Exception:
            return None
    return _shap_explainer


def _construir_features(edad, ingresos, estado_civil, deudas_existentes,
                        saldo_cuentas, historial_pagos, tiempo_empleo, tipo_empleo,
                        patrimonio):
    relacion_deuda_ingreso = deudas_existentes / ingresos if ingresos > 0 else 0
    return np.array([[edad, ingresos, estado_civil,
                      deudas_existentes, relacion_deuda_ingreso, saldo_cuentas,
                      historial_pagos, tiempo_empleo, tipo_empleo, patrimonio]], dtype=float)


def predecir_riesgo(edad, ingresos, estado_civil, deudas_existentes,
                    saldo_cuentas, historial_pagos, tiempo_empleo, tipo_empleo,
                    patrimonio):
    datos = _construir_features(edad, ingresos, estado_civil, deudas_existentes,
                                saldo_cuentas, historial_pagos, tiempo_empleo, tipo_empleo,
                                patrimonio)
    datos_norm = (datos - media) / (desviacion + 1e-8)
    tensor = torch.tensor(datos_norm, dtype=torch.float32)
    with torch.no_grad():
        prob = modelo_ml(tensor).item()
    return prob


def explicar_riesgo(edad, ingresos, estado_civil, deudas_existentes,
                    saldo_cuentas, historial_pagos, tiempo_empleo, tipo_empleo,
                    patrimonio):
    """Devuelve dict feature->valor SHAP. Si SHAP no esta disponible, devuelve None."""
    explainer = _obtener_explainer()
    if explainer is None:
        return None
    try:
        datos = _construir_features(edad, ingresos, estado_civil, deudas_existentes,
                                    saldo_cuentas, historial_pagos, tiempo_empleo, tipo_empleo,
                                    patrimonio)
        datos_norm = (datos - media) / (desviacion + 1e-8)
        tensor = torch.tensor(datos_norm, dtype=torch.float32)
        valores = explainer.shap_values(tensor, check_additivity=False)
        if isinstance(valores, list):
            valores = valores[0]
        valores = np.array(valores).reshape(-1)
        return {nombre: round(float(v), 4) for nombre, v in zip(NOMBRES_FEATURES, valores)}
    except Exception:
        return None


# --- Interpretacion del resultado del modelo ---
#
# Las politicas crediticias siguientes estan calibradas sobre el mercado bancario
# colombiano (referencia: tasa de usura Superfinanciera, capacidad de pago = 30%
# del ingreso, SMMLV 2026 ~ $1.650.000).
#
# La filosofia es:
#   - Monto / cupo = funcion de la CAPACIDAD DE PAGO real (ingreso menos
#     deudas existentes) por el PLAZO del producto, ajustado por riesgo.
#   - Tasas de interes = tasa base + spread por nivel de riesgo (Risk-Based Pricing).

NIVELES = ["Bajo", "Moderado", "Alto", "Muy alto"]

# Porcentaje maximo del ingreso destinado a cuotas (politica bancaria colombiana: 30%)
CAPACIDAD_PAGO_RATIO = 0.30
# Plazo asumido para amortizar deudas existentes (meses).
# Los creditos hipotecarios NO se incluyen en este calculo — se asume que el
# usuario solo declara deudas de consumo (tarjetas, libranzas, libre inversion).
PLAZO_DEUDA_ACTUAL = 60

NOMBRES_PRODUCTO = {
    "hipoteca": "Hipoteca",
    "prestamo": "Préstamo",
    "credito": "Crédito",
    "debito": "Débito",
}

# Productos que el cliente puede solicitar desde el formulario de credito,
# ordenados de mas exclusivo (mayor exigencia) a mas permisivo.
PRODUCTOS_SOLICITABLES = ["hipoteca", "prestamo", "credito", "debito"]

NIVEL_INDICE = {"Bajo": 0, "Moderado": 1, "Alto": 2, "Muy alto": 3}

# Tasas EA por producto y nivel de riesgo (referencia: tasas vigentes en bancos
# colombianos 2024-2026; la tasa de usura para credito de consumo se mueve
# en ~25-30% EA, hipotecario VIS ~11-13%).
TASAS_PRODUCTO: dict[str, dict] = {
    "hipoteca": {"Bajo": 11.5, "Moderado": 13.5, "Alto": None, "Muy alto": None},
    "prestamo": {"Bajo": 16.0, "Moderado": 20.0, "Alto": 25.0, "Muy alto": None},
    "credito":  {"Bajo": 22.0, "Moderado": 26.0, "Alto": 28.5, "Muy alto": None},
    "debito":   {"Bajo": 0.0,  "Moderado": 0.0,  "Alto": 0.0,  "Muy alto": 0.0},
}

# Plazo maximo (meses) por producto — usado para calcular monto maximo por capacidad de pago
PLAZO_MAX_PRODUCTO = {
    "hipoteca": 240,   # 20 anios
    "prestamo": 60,    # 5 anios
    "credito": 18,     # rotativo, ciclo promedio 18 meses
    "debito": 0,
}

# Factor de ajuste por riesgo: el banco presta menos a mayor riesgo.
# Calibrado conservadoramente (~la mitad del maximo teorico de capacidad)
# para reflejar politicas reales colombianas, donde la hipoteca rara vez
# excede 4-5x el ingreso anual.
FACTOR_RIESGO_MONTO = {"Bajo": 0.50, "Moderado": 0.38, "Alto": 0.25, "Muy alto": 0.0}

# Requisitos por producto (politica bancaria colombiana realista).
# Un producto aplica solo si:
#   - el nivel de riesgo del cliente <= nivel_max
#   - todos los umbrales de perfil se cumplen
#   - el cliente NO esta en estado de sobre-endeudamiento (ratio_deuda_max)
#   - tiene la capacidad de pago minima para el monto del producto
REQUISITOS_PRODUCTO: dict[str, dict] = {
    "hipoteca": {
        # Hipoteca: producto mas exclusivo. El banco asume riesgo de largo plazo (20+ anios)
        # y necesita garantia de estabilidad maxima.
        "nivel_max": "Bajo",
        "historial_minimo": 0.80,
        "ingresos_minimos": 3_000_000,        # ~1.8 SMMLV
        "ratio_deuda_max": 0.35,              # endeudamiento total < 35%
        "tiempo_empleo_minimo": 2.0,
        "edad_minima": 25,
        "edad_maxima": 65,                    # debe terminar de pagar antes de los 85
    },
    "prestamo": {
        "nivel_max": "Moderado",
        "historial_minimo": 0.65,
        "ingresos_minimos": 1_650_000,        # 1 SMMLV
        "ratio_deuda_max": 0.55,
        "tiempo_empleo_minimo": 1.0,
        "edad_minima": 21,
        "edad_maxima": 70,
    },
    "credito": {
        "nivel_max": "Alto",
        "historial_minimo": 0.55,
        "ingresos_minimos": 1_100_000,        # ~0.66 SMMLV
        "ratio_deuda_max": 0.80,
        "tiempo_empleo_minimo": 0.5,
        "edad_minima": 18,
        "edad_maxima": 75,
    },
    "debito": {
        # Cuenta de debito: siempre disponible (no es un credito).
        "nivel_max": "Muy alto",
    },
}

# Vista derivada (compatibilidad y documentacion): que productos aplican como minimo
# por nivel de riesgo, ignorando los demas umbrales del perfil.
PRODUCTOS_POR_NIVEL = {
    nivel: {
        producto for producto, req in REQUISITOS_PRODUCTO.items()
        if NIVEL_INDICE[nivel] <= NIVEL_INDICE[req["nivel_max"]]
    }
    for nivel in NIVEL_INDICE
}


def _nivel_de_riesgo(prob: float) -> str:
    if prob < 0.25:
        return "Bajo"
    if prob < 0.50:
        return "Moderado"
    if prob < 0.75:
        return "Alto"
    return "Muy alto"


def _evaluar_aplicabilidad(producto: str, nivel: str, historial_pagos: float,
                           ingresos: float, deudas: float, tiempo_empleo: float,
                           edad: Optional[int] = None) -> tuple[bool, list[str]]:
    """Evalua si el perfil cumple todos los requisitos del producto.
    Devuelve (aplica, razones_rechazo). Razones quedan vacias si aplica."""
    req = REQUISITOS_PRODUCTO.get(producto)
    if req is None:
        return False, ["producto desconocido"]

    razones: list[str] = []

    nivel_max = req["nivel_max"]
    if NIVEL_INDICE[nivel] > NIVEL_INDICE[nivel_max]:
        razones.append(f"tu nivel de riesgo ({nivel}) supera el máximo permitido ({nivel_max})")

    if "historial_minimo" in req and historial_pagos < req["historial_minimo"]:
        razones.append(
            f"historial de pagos {historial_pagos:.2f} por debajo del mínimo {req['historial_minimo']:.2f}"
        )

    if "ingresos_minimos" in req and ingresos < req["ingresos_minimos"]:
        razones.append(
            f"ingresos por debajo del mínimo requerido (${int(req['ingresos_minimos']):,})".replace(",", ".")
        )

    if "ratio_deuda_max" in req:
        ratio_total = deudas / max(ingresos, 1)
        if ratio_total > req["ratio_deuda_max"] * PLAZO_DEUDA_ACTUAL / 12:
            razones.append(
                f"endeudamiento actual ({ratio_total:.1f}x ingreso mensual) excede tu capacidad"
            )

    if "tiempo_empleo_minimo" in req and tiempo_empleo < req["tiempo_empleo_minimo"]:
        meses_min = req["tiempo_empleo_minimo"] * 12
        if meses_min < 12:
            razones.append(f"antigüedad laboral menor a {int(meses_min)} meses")
        else:
            razones.append(f"antigüedad laboral menor a {req['tiempo_empleo_minimo']:.0f} año(s)")

    if edad is not None:
        if "edad_minima" in req and edad < req["edad_minima"]:
            razones.append(f"edad mínima requerida: {req['edad_minima']} años")
        if "edad_maxima" in req and edad > req["edad_maxima"]:
            razones.append(f"edad máxima permitida: {req['edad_maxima']} años")

    return len(razones) == 0, razones


def _calcular_capacidad_pago(ingresos: float, deudas: float) -> float:
    """Capacidad de pago mensual disponible para nuevas cuotas, despues de
    cubrir el servicio de deudas existentes."""
    cuota_actual = deudas / PLAZO_DEUDA_ACTUAL
    disponible = max(ingresos * CAPACIDAD_PAGO_RATIO - cuota_actual, 0)
    return disponible


def _calcular_monto_producto(producto: str, nivel: str, ingresos: float, deudas: float) -> float:
    """Calcula el monto/cupo maximo aprobable para el producto, basado en la
    capacidad de pago real del cliente y ajustado por nivel de riesgo."""
    if producto == "debito":
        return 0
    if nivel == "Muy alto":
        return 0

    capacidad = _calcular_capacidad_pago(ingresos, deudas)
    plazo = PLAZO_MAX_PRODUCTO[producto]
    factor_riesgo = FACTOR_RIESGO_MONTO[nivel]

    if producto == "credito":
        # Cupo rotativo: 2-3 veces el ingreso mensual segun riesgo, capado
        cupo = ingresos * (3.5 * factor_riesgo)
        # No otorgar mas cupo del que la capacidad de pago soporta en 18 meses
        cupo_max_capacidad = capacidad * plazo
        return round(min(cupo, cupo_max_capacidad))

    # Hipoteca / prestamo: monto = capacidad * plazo * factor_riesgo
    monto = capacidad * plazo * factor_riesgo
    return round(monto)


_RAZONES_RECOMENDACION = {
    "hipoteca": "Perfil sólido — apto para crédito hipotecario",
    "prestamo": "Perfil estable — apto para préstamo personal",
    "credito": "Perfil moderado — apto para tarjeta de crédito",
    "debito": "Comenzar a construir historial financiero con cuenta de débito",
}


def _recomendar_producto(prob: float, ingresos: float, deudas: float,
                         historial_pagos: float, tiempo_empleo: float,
                         edad: Optional[int] = None) -> dict:
    nivel = _nivel_de_riesgo(prob)
    # Recorrer del mas exclusivo al mas permisivo y devolver el primero que aplica.
    for producto in PRODUCTOS_SOLICITABLES:
        aplica, _ = _evaluar_aplicabilidad(
            producto, nivel, historial_pagos, ingresos, deudas, tiempo_empleo, edad,
        )
        if aplica:
            return {
                "clave": producto,
                "nombre": NOMBRES_PRODUCTO[producto],
                "razon": _RAZONES_RECOMENDACION[producto],
            }
    # Debito no tiene requisitos extras, asi que siempre debe aplicar; este return es solo para mypy.
    return {
        "clave": "debito",
        "nombre": NOMBRES_PRODUCTO["debito"],
        "razon": _RAZONES_RECOMENDACION["debito"],
    }


def _evaluar_producto_solicitado(nivel: str, producto_solicitado: Optional[str],
                                 historial_pagos: float, ingresos: float, deudas: float,
                                 tiempo_empleo: float, edad: Optional[int] = None) -> Optional[dict]:
    if not producto_solicitado:
        return None
    nombre = NOMBRES_PRODUCTO.get(producto_solicitado, producto_solicitado)
    aplica, razones = _evaluar_aplicabilidad(
        producto_solicitado, nivel, historial_pagos, ingresos, deudas, tiempo_empleo, edad,
    )

    monto_aprobado = _calcular_monto_producto(producto_solicitado, nivel, ingresos, deudas) if aplica else 0
    tasa = TASAS_PRODUCTO.get(producto_solicitado, {}).get(nivel)

    if aplica:
        if producto_solicitado == "debito":
            razon = "Cuenta de débito aprobada. Sin requisitos crediticios."
        else:
            monto_fmt = f"${int(monto_aprobado):,}".replace(",", ".")
            tasa_fmt = f"{tasa:.1f}% EA" if tasa is not None else "N/A"
            etiqueta = "Cupo" if producto_solicitado == "credito" else "Monto"
            razon = f"Aprobado. {etiqueta}: {monto_fmt} · Tasa: {tasa_fmt} · Riesgo {nivel}."
    else:
        razon = "No aplica: " + "; ".join(razones) + "."

    return {
        "clave": producto_solicitado,
        "nombre": nombre,
        "aplica": aplica,
        "razon": razon,
        "monto_aprobado": monto_aprobado if aplica else 0,
        "tasa_aplicada": tasa if aplica else None,
    }


def interpretar_resultado(prob: float, ingresos: float, deudas: float,
                          historial_pagos: float, tiempo_empleo: float,
                          producto_solicitado: Optional[str] = None,
                          edad: Optional[int] = None) -> dict:
    nivel = _nivel_de_riesgo(prob)
    recomendado = _recomendar_producto(
        prob, ingresos, deudas, historial_pagos, tiempo_empleo, edad,
    )
    # Monto y tasa sugerida = los del producto recomendado (no hay un "monto generico")
    monto_max = _calcular_monto_producto(recomendado["clave"], nivel, ingresos, deudas)
    tasa = TASAS_PRODUCTO.get(recomendado["clave"], {}).get(nivel)

    return {
        "nivel_riesgo": nivel,
        "riesgo_porcentaje": round(prob * 100, 1),
        "monto_maximo": monto_max,
        "tasa_sugerida": tasa,
        "capacidad_pago_mensual": round(_calcular_capacidad_pago(ingresos, deudas)),
        "producto_recomendado": recomendado,
        "producto_solicitado_evaluacion": _evaluar_producto_solicitado(
            nivel, producto_solicitado, historial_pagos, ingresos, deudas, tiempo_empleo, edad,
        ),
    }


# --- Modelos Pydantic ---

class BuscarCliente(BaseModel):
    nombre: str = Field(..., min_length=1, examples=["Michi Lopez"])
    correo: str = Field(..., min_length=3, examples=["michi@gatuno.com"])

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, value: str) -> str:
        return validar_y_normalizar_nombre(value, "nombre")

    @field_validator("correo")
    @classmethod
    def validar_correo(cls, value: str) -> str:
        correo = value.strip().lower()
        if not CORREO_REGEX.match(correo):
            raise ValueError("Correo electrónico inválido")
        return correo


class ClientePayload(BaseModel):
    nombre: str = Field(..., min_length=1, examples=["Michi Lopez"])
    correo: str = Field(..., min_length=3, examples=["michi@gatuno.com"])
    edad: int = Field(..., ge=18, le=80, examples=[30])
    ingresos: float = Field(..., gt=0, le=500000000, examples=[5000000])
    estado_civil: int = Field(..., ge=0, le=1, examples=[0])  # 0 = soltero, 1 = casado
    deudas_existentes: float = Field(..., ge=0, le=1000000000, examples=[10000000])
    saldo_cuentas: float = Field(..., ge=0, le=1000000000, examples=[20000000])
    historial_pagos: float = Field(default=0.7, ge=0, le=1, examples=[0.85])
    tiempo_empleo: float = Field(default=2.0, ge=0, le=50, examples=[5.0])
    tipo_empleo: int = Field(default=1, ge=0, le=3, examples=[1])  # 0=informal, 1=empleado, 2=independiente, 3=pensionado
    patrimonio: float = Field(..., ge=0, le=2_000_000_000, examples=[30_000_000])
    producto_solicitado: Optional[Literal["hipoteca", "prestamo", "credito", "debito"]] = Field(
        default=None,
        examples=["credito"],
    )
    productos: list["ProductoBancario"] = Field(default_factory=list)

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, value: str) -> str:
        return validar_y_normalizar_nombre(value, "nombre")

    @field_validator("correo")
    @classmethod
    def validar_correo(cls, value: str) -> str:
        correo = value.strip().lower()
        if not CORREO_REGEX.match(correo):
            raise ValueError("Correo electrónico inválido")
        return correo

    @model_validator(mode="after")
    def validar_consistencia_financiera(self):
        ratio_deuda_ingreso = self.deudas_existentes / self.ingresos
        if ratio_deuda_ingreso > MAX_DEBT_TO_INCOME_RATIO:
            raise ValueError(
                f"Las deudas existentes no pueden superar {MAX_DEBT_TO_INCOME_RATIO} veces los ingresos"
            )
        return self


class ProductoBancarioBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=80)
    numero_producto: str = Field(..., min_length=4, max_length=30, examples=["CTA-1001"])
    activo: bool = Field(default=True)

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, value: str) -> str:
        return validar_y_normalizar_nombre(value, "nombre del producto")

    @field_validator("numero_producto")
    @classmethod
    def validar_numero_producto(cls, value: str) -> str:
        numero = value.strip().upper()
        if not re.match(r"^[A-Z0-9-]+$", numero):
            raise ValueError("El número del producto solo puede contener letras, números y guiones")
        return numero


class Debito(ProductoBancarioBase):
    tipo: Literal["debito"]
    saldo: float = Field(default=0, ge=0)


class Credito(ProductoBancarioBase):
    tipo: Literal["credito"]
    cupo_credito: float = Field(..., gt=0, le=300000000)
    saldo_utilizado: float = Field(default=0, ge=0)
    tasa_interes_anual: float = Field(..., ge=0, le=100)

    @model_validator(mode="after")
    def validar_saldo_credito(self):
        if self.saldo_utilizado > self.cupo_credito:
            raise ValueError("El saldo utilizado no puede superar el cupo de crédito")
        return self


class Prestamo(ProductoBancarioBase):
    tipo: Literal["prestamo"]
    monto_desembolsado: float = Field(..., gt=0)
    saldo_pendiente: float = Field(..., ge=0)
    plazo_meses: int = Field(..., ge=1, le=240)
    tasa_interes_anual: float = Field(..., ge=0, le=100)

    @model_validator(mode="after")
    def validar_saldo_prestamo(self):
        if self.saldo_pendiente > self.monto_desembolsado:
            raise ValueError("El saldo pendiente no puede superar el monto desembolsado")
        return self


class Hipoteca(ProductoBancarioBase):
    tipo: Literal["hipoteca"]
    monto_desembolsado: float = Field(..., gt=0)
    saldo_pendiente: float = Field(..., ge=0)
    plazo_meses: int = Field(..., ge=12, le=360)
    tasa_interes_anual: float = Field(..., ge=0, le=100)

    @model_validator(mode="after")
    def validar_saldo_hipoteca(self):
        if self.saldo_pendiente > self.monto_desembolsado:
            raise ValueError("El saldo pendiente no puede superar el monto desembolsado")
        return self


ProductoBancario = Annotated[
    Union[Hipoteca, Prestamo, Credito, Debito],
    Field(discriminator="tipo"),
]
PRODUCTO_BANCARIO_ADAPTER = TypeAdapter(ProductoBancario)


class ClienteNuevo(ClientePayload):
    """Datos requeridos para crear un cliente nuevo."""

    pass


class ClienteActualizar(ClientePayload):
    """Datos completos para actualizar un cliente existente."""

    pass


class ProductoRecomendado(BaseModel):
    clave: str
    nombre: str
    razon: str


class ProductoSolicitadoEvaluacion(BaseModel):
    clave: str
    nombre: str
    aplica: bool
    razon: str
    monto_aprobado: float = 0
    tasa_aplicada: Optional[float] = None


class Cliente(BaseModel):
    id: int
    nombre: str
    correo: str
    edad: int
    ingresos: float
    estado_civil: int
    deudas_existentes: float
    saldo_cuentas: float
    historial_pagos: float
    tiempo_empleo: float
    tipo_empleo: int
    patrimonio: float
    producto_solicitado: Optional[str] = None
    archivado: bool = False
    productos: list[ProductoBancario]
    probabilidad_riesgo: float
    credito_aprobado: bool
    nivel_riesgo: str
    riesgo_porcentaje: float
    monto_maximo: float
    tasa_sugerida: Optional[float] = None
    producto_recomendado: ProductoRecomendado
    producto_solicitado_evaluacion: Optional[ProductoSolicitadoEvaluacion] = None
    capacidad_pago_mensual: float = 0
    explicacion: Optional[dict[str, float]] = None


class BuscarClienteResponse(BaseModel):
    encontrado: bool
    cliente: Optional[Cliente] = None


class ClienteResponse(BaseModel):
    cliente: Cliente


class MensajeResponse(BaseModel):
    mensaje: str


class EliminarResponse(BaseModel):
    # "archivado" = soft-delete (primer intento); "eliminado" = borrado definitivo.
    accion: Literal["archivado", "eliminado"]
    mensaje: str


class CatalogoProducto(BaseModel):
    tipo: str
    descripcion: str


CATALOGO_PRODUCTOS = [
    {"tipo": "hipoteca", "descripcion": "Crédito hipotecario para vivienda con plazo largo"},
    {"tipo": "prestamo", "descripcion": "Préstamo de libre inversión con cuotas mensuales"},
    {"tipo": "credito", "descripcion": "Tarjeta de crédito rotativo con cupo y tasa anual"},
    {"tipo": "debito", "descripcion": "Cuenta de débito para ahorro y disponibilidad inmediata"},
]


def validar_y_normalizar_nombre(value: str, campo: str) -> str:
    nombre = value.strip()
    if len(nombre) < 3:
        raise ValueError(f"El campo '{campo}' debe tener al menos 3 caracteres")
    return nombre


# --- Persistencia (SQLite vía SQLAlchemy) ---

def parsear_productos(productos: list[dict]) -> list[ProductoBancario]:
    return [PRODUCTO_BANCARIO_ADAPTER.validate_python(producto) for producto in productos]


def _scoring(datos: ClientePayload) -> dict:
    """Predice + interpreta + explica. Solo lógica de modelo, no toca BD."""
    prob_riesgo = predecir_riesgo(
        datos.edad, datos.ingresos, datos.estado_civil,
        datos.deudas_existentes, datos.saldo_cuentas,
        datos.historial_pagos, datos.tiempo_empleo, datos.tipo_empleo,
        datos.patrimonio,
    )
    interpretacion = interpretar_resultado(
        prob_riesgo, datos.ingresos, datos.deudas_existentes,
        datos.historial_pagos, datos.tiempo_empleo,
        producto_solicitado=datos.producto_solicitado,
        edad=datos.edad,
    )
    explicacion = explicar_riesgo(
        datos.edad, datos.ingresos, datos.estado_civil,
        datos.deudas_existentes, datos.saldo_cuentas,
        datos.historial_pagos, datos.tiempo_empleo, datos.tipo_empleo,
        datos.patrimonio,
    )
    return {
        "probabilidad_riesgo": round(prob_riesgo, 4),
        "credito_aprobado": prob_riesgo < 0.5,
        "nivel_riesgo": interpretacion["nivel_riesgo"],
        "riesgo_porcentaje": interpretacion["riesgo_porcentaje"],
        "monto_maximo": interpretacion["monto_maximo"],
        "tasa_sugerida": interpretacion["tasa_sugerida"],
        "producto_recomendado": interpretacion["producto_recomendado"],
        "producto_solicitado_evaluacion": interpretacion["producto_solicitado_evaluacion"],
        "explicacion": explicacion,
    }


def _aplicar_scoring(cliente_db: ClienteDB, datos: ClientePayload) -> None:
    """Vuelca los campos del payload + el scoring del modelo sobre el ORM."""
    cliente_db.nombre = datos.nombre
    cliente_db.correo = datos.correo
    cliente_db.edad = datos.edad
    cliente_db.ingresos = datos.ingresos
    cliente_db.estado_civil = datos.estado_civil
    cliente_db.deudas_existentes = datos.deudas_existentes
    cliente_db.saldo_cuentas = datos.saldo_cuentas
    cliente_db.historial_pagos = datos.historial_pagos
    cliente_db.tiempo_empleo = datos.tiempo_empleo
    cliente_db.tipo_empleo = datos.tipo_empleo
    cliente_db.patrimonio = datos.patrimonio
    cliente_db.producto_solicitado = datos.producto_solicitado

    s = _scoring(datos)
    cliente_db.probabilidad_riesgo = s["probabilidad_riesgo"]
    cliente_db.credito_aprobado = s["credito_aprobado"]
    cliente_db.nivel_riesgo = s["nivel_riesgo"]
    cliente_db.riesgo_porcentaje = s["riesgo_porcentaje"]
    cliente_db.monto_maximo = s["monto_maximo"]
    cliente_db.tasa_sugerida = s["tasa_sugerida"]
    cliente_db.producto_recomendado_json = json.dumps(s["producto_recomendado"])
    cliente_db.producto_solicitado_evaluacion_json = (
        json.dumps(s["producto_solicitado_evaluacion"])
        if s["producto_solicitado_evaluacion"] is not None
        else None
    )
    cliente_db.explicacion_json = (
        json.dumps(s["explicacion"]) if s["explicacion"] is not None else None
    )


def buscar_cliente_por_id(db: Session, cliente_id: int) -> Optional[ClienteDB]:
    return db.get(ClienteDB, cliente_id)


def buscar_cliente_por_correo(db: Session, correo: str) -> Optional[ClienteDB]:
    correo_normalizado = correo.strip().lower()
    return db.query(ClienteDB).filter(ClienteDB.correo == correo_normalizado).first()


def listar_clientes_db(db: Session, incluir_archivados: bool = False) -> list[dict]:
    consulta = db.query(ClienteDB)
    if not incluir_archivados:
        consulta = consulta.filter(ClienteDB.archivado.is_(False))
    clientes = consulta.order_by(ClienteDB.id).all()
    return [cliente_db_a_dict(c) for c in clientes]


_TIPO_EMPLEO_LABEL = {0: "Informal", 1: "Empleado", 2: "Independiente", 3: "Pensionado"}


def calcular_estadisticas_clientes(db: Session) -> dict:
    """Agrega la cartera de clientes activos en KPIs y distribuciones para el
    dashboard. Todo se deriva de la BD, así que se actualiza solo al crear,
    editar o eliminar clientes."""
    clientes = db.query(ClienteDB).filter(ClienteDB.archivado.is_(False)).all()
    total = len(clientes)

    # Estructuras base (siempre presentes, aunque la cartera esté vacía)
    distribucion_riesgo = {nivel: 0 for nivel in NIVELES}
    distribucion_tipo_empleo = {label: 0 for label in _TIPO_EMPLEO_LABEL.values()}
    distribucion_estado_civil = {"Soltero": 0, "Casado": 0}
    distribucion_producto_solicitado = {p: 0 for p in PRODUCTOS_SOLICITABLES}
    productos_bancarios_por_tipo = {p: 0 for p in PRODUCTOS_SOLICITABLES}
    suma_ingreso_empleo = {label: 0.0 for label in _TIPO_EMPLEO_LABEL.values()}

    if total == 0:
        return {
            "total_clientes": 0,
            "aprobados": 0,
            "rechazados": 0,
            "archivados": db.query(ClienteDB).filter(ClienteDB.archivado.is_(True)).count(),
            "tasa_aprobacion": 0.0,
            "riesgo_promedio": 0.0,
            "ingreso_promedio": 0.0,
            "ingreso_mediano": 0.0,
            "edad_promedio": 0.0,
            "patrimonio_promedio": 0.0,
            "deuda_promedio": 0.0,
            "monto_total_aprobado": 0.0,
            "distribucion_riesgo": distribucion_riesgo,
            "distribucion_tipo_empleo": distribucion_tipo_empleo,
            "distribucion_estado_civil": distribucion_estado_civil,
            "distribucion_producto_solicitado": distribucion_producto_solicitado,
            "productos_bancarios_por_tipo": productos_bancarios_por_tipo,
            "ingreso_promedio_por_empleo": suma_ingreso_empleo,
        }

    aprobados = 0
    suma_ingreso = 0.0
    suma_edad = 0.0
    suma_patrimonio = 0.0
    suma_deuda = 0.0
    suma_riesgo = 0.0
    monto_total_aprobado = 0.0
    ingresos_lista: list[float] = []

    for c in clientes:
        if c.credito_aprobado:
            aprobados += 1
            monto_total_aprobado += c.monto_maximo or 0
        distribucion_riesgo[c.nivel_riesgo] = distribucion_riesgo.get(c.nivel_riesgo, 0) + 1
        empleo_label = _TIPO_EMPLEO_LABEL.get(c.tipo_empleo, "Empleado")
        distribucion_tipo_empleo[empleo_label] += 1
        suma_ingreso_empleo[empleo_label] += c.ingresos
        distribucion_estado_civil["Casado" if c.estado_civil == 1 else "Soltero"] += 1
        if c.producto_solicitado in distribucion_producto_solicitado:
            distribucion_producto_solicitado[c.producto_solicitado] += 1
        for p in c.productos:
            if p.tipo in productos_bancarios_por_tipo:
                productos_bancarios_por_tipo[p.tipo] += 1
        suma_ingreso += c.ingresos
        suma_edad += c.edad
        suma_patrimonio += c.patrimonio
        suma_deuda += c.deudas_existentes
        suma_riesgo += c.probabilidad_riesgo
        ingresos_lista.append(c.ingresos)

    ingresos_lista.sort()
    mediana = ingresos_lista[total // 2]

    # Ingreso promedio por segmento de empleo (0 si el segmento no tiene clientes)
    ingreso_promedio_por_empleo = {
        label: round(suma_ingreso_empleo[label] / distribucion_tipo_empleo[label])
        if distribucion_tipo_empleo[label] > 0
        else 0
        for label in _TIPO_EMPLEO_LABEL.values()
    }

    return {
        "total_clientes": total,
        "aprobados": aprobados,
        "rechazados": total - aprobados,
        "archivados": db.query(ClienteDB).filter(ClienteDB.archivado.is_(True)).count(),
        "tasa_aprobacion": round(aprobados / total * 100, 1),
        "riesgo_promedio": round(suma_riesgo / total * 100, 1),
        "ingreso_promedio": round(suma_ingreso / total),
        "ingreso_mediano": round(mediana),
        "edad_promedio": round(suma_edad / total, 1),
        "patrimonio_promedio": round(suma_patrimonio / total),
        "deuda_promedio": round(suma_deuda / total),
        "monto_total_aprobado": round(monto_total_aprobado),
        "distribucion_riesgo": distribucion_riesgo,
        "distribucion_tipo_empleo": distribucion_tipo_empleo,
        "distribucion_estado_civil": distribucion_estado_civil,
        "distribucion_producto_solicitado": distribucion_producto_solicitado,
        "productos_bancarios_por_tipo": productos_bancarios_por_tipo,
        "ingreso_promedio_por_empleo": ingreso_promedio_por_empleo,
    }


def validar_correo_unico(db: Session, correo: str, cliente_id_actual: Optional[int] = None) -> None:
    existente = buscar_cliente_por_correo(db, correo)
    if existente and existente.id != cliente_id_actual:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un cliente registrado con ese correo",
        )


def validar_numero_producto_unico(
    db: Session, numero_producto: str, cliente_id_actual: Optional[int] = None,
) -> None:
    consulta = db.query(ProductoBancarioDB).filter(
        ProductoBancarioDB.numero_producto == numero_producto
    )
    if cliente_id_actual is not None:
        consulta = consulta.filter(ProductoBancarioDB.cliente_id != cliente_id_actual)
    if consulta.first() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un producto bancario con ese número",
        )


def validar_productos_cliente(
    db: Session, productos: list[ProductoBancario], cliente_id_actual: Optional[int] = None,
) -> None:
    numeros_en_payload: set[str] = set()
    for producto in productos:
        if producto.numero_producto in numeros_en_payload:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No se permiten números de producto repetidos en el mismo cliente",
            )
        numeros_en_payload.add(producto.numero_producto)
        validar_numero_producto_unico(db, producto.numero_producto, cliente_id_actual)


def crear_cliente(db: Session, datos: ClienteNuevo) -> dict:
    validar_correo_unico(db, datos.correo)
    validar_productos_cliente(db, datos.productos)

    cliente_db = ClienteDB()
    _aplicar_scoring(cliente_db, datos)
    db.add(cliente_db)
    db.flush()  # asigna el id antes de crear los productos hijos

    for producto in datos.productos:
        db.add(producto_dict_a_db(producto.model_dump(), cliente_db.id))

    db.commit()
    db.refresh(cliente_db)
    return cliente_db_a_dict(cliente_db)


def recalcular_cliente_por_correo(
    db: Session, correo: str, producto_solicitado: Optional[str] = None,
) -> Optional[dict]:
    cliente_db = buscar_cliente_por_correo(db, correo)
    if not cliente_db:
        return None

    datos = ClientePayload(
        nombre=cliente_db.nombre,
        correo=cliente_db.correo,
        edad=cliente_db.edad,
        ingresos=cliente_db.ingresos,
        estado_civil=cliente_db.estado_civil,
        deudas_existentes=cliente_db.deudas_existentes,
        saldo_cuentas=cliente_db.saldo_cuentas,
        historial_pagos=cliente_db.historial_pagos,
        tiempo_empleo=cliente_db.tiempo_empleo,
        tipo_empleo=cliente_db.tipo_empleo,
        patrimonio=cliente_db.patrimonio,
        producto_solicitado=producto_solicitado or cliente_db.producto_solicitado,
        productos=parsear_productos([producto_db_a_dict(p) for p in cliente_db.productos]),
    )
    _aplicar_scoring(cliente_db, datos)
    db.commit()
    db.refresh(cliente_db)
    return cliente_db_a_dict(cliente_db)


# --- Auth ---

class LoginPayload(BaseModel):
    usuario: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


@app.post("/api/login", tags=["Auth"])
async def login(request: Request, datos: LoginPayload):
    if datos.usuario == ADMIN_USUARIO and datos.password == ADMIN_PASSWORD:
        request.session["admin"] = True
        return {"ok": True, "admin": True}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Usuario o contraseña incorrectos",
    )


@app.post("/api/logout", tags=["Auth"])
async def logout(request: Request):
    request.session.clear()
    return {"ok": True}


@app.get("/api/sesion", tags=["Auth"])
async def sesion(request: Request):
    return {"admin": bool(request.session.get("admin", False))}


# --- API ---

@app.post("/api/buscar-cliente", response_model=BuscarClienteResponse, tags=["Clientes"])
async def buscar_cliente(datos: BuscarCliente, db: Session = Depends(get_db)):
    cliente = buscar_cliente_por_correo(db, datos.correo)
    if cliente:
        return {"encontrado": True, "cliente": cliente_db_a_dict(cliente)}
    return {"encontrado": False}


@app.post(
    "/api/solicitar-credito",
    response_model=ClienteResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Créditos"],
)
async def solicitar_credito(cliente: ClienteNuevo, db: Session = Depends(get_db)):
    return {"cliente": crear_cliente(db, cliente)}


class SolicitarExistentePayload(BuscarCliente):
    producto_solicitado: Optional[Literal["hipoteca", "prestamo", "credito", "debito"]] = None


@app.post("/api/solicitar-credito-existente", response_model=ClienteResponse, tags=["Créditos"])
async def solicitar_credito_existente(
    datos: SolicitarExistentePayload, db: Session = Depends(get_db),
):
    cliente_actualizado = recalcular_cliente_por_correo(
        db, datos.correo, producto_solicitado=datos.producto_solicitado,
    )
    if not cliente_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )
    return {"cliente": cliente_actualizado}


@app.post(
    "/api/clientes",
    response_model=ClienteResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Clientes"],
)
async def crear_cliente_endpoint(cliente: ClienteNuevo, db: Session = Depends(get_db)):
    return {"cliente": crear_cliente(db, cliente)}


@app.get("/api/clientes", response_model=list[Cliente], tags=["Clientes"])
async def listar_clientes(incluir_archivados: bool = False, db: Session = Depends(get_db)):
    return listar_clientes_db(db, incluir_archivados=incluir_archivados)


@app.get("/api/productos-bancarios/catalogo", response_model=list[CatalogoProducto], tags=["Productos Bancarios"])
async def listar_catalogo_productos():
    return CATALOGO_PRODUCTOS


@app.get("/api/clientes/estadisticas", tags=["Clientes"])
async def estadisticas_clientes(db: Session = Depends(get_db)):
    """Estadísticas agregadas de la cartera para el dashboard. Se recalcula en
    cada request a partir de la BD, así que refleja siempre el estado actual."""
    return calcular_estadisticas_clientes(db)


@app.get("/api/clientes/{cliente_id}", response_model=Cliente, tags=["Clientes"])
async def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = buscar_cliente_por_id(db, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )
    return cliente_db_a_dict(cliente)


@app.put("/api/clientes/{cliente_id}", response_model=ClienteResponse, tags=["Clientes"])
async def actualizar_cliente(
    cliente_id: int, datos: ClienteActualizar, db: Session = Depends(get_db),
):
    cliente_db = buscar_cliente_por_id(db, cliente_id)
    if not cliente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    validar_correo_unico(db, datos.correo, cliente_id_actual=cliente_id)
    validar_productos_cliente(db, datos.productos, cliente_id_actual=cliente_id)

    _aplicar_scoring(cliente_db, datos)
    # Reemplaza productos: elimina los existentes y agrega los del payload.
    cliente_db.productos.clear()
    db.flush()
    for producto in datos.productos:
        db.add(producto_dict_a_db(producto.model_dump(), cliente_db.id))

    db.commit()
    db.refresh(cliente_db)
    return {"cliente": cliente_db_a_dict(cliente_db)}


@app.post("/api/clientes/{cliente_id}/productos", response_model=ClienteResponse, tags=["Productos Bancarios"])
async def agregar_producto_cliente(
    cliente_id: int, producto: ProductoBancario, db: Session = Depends(get_db),
):
    cliente_db = buscar_cliente_por_id(db, cliente_id)
    if not cliente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    validar_numero_producto_unico(db, producto.numero_producto, cliente_id_actual=cliente_id)
    db.add(producto_dict_a_db(producto.model_dump(), cliente_id))
    db.commit()
    db.refresh(cliente_db)
    return {"cliente": cliente_db_a_dict(cliente_db)}


@app.get("/api/clientes/{cliente_id}/productos", response_model=list[ProductoBancario], tags=["Productos Bancarios"])
async def listar_productos_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente_db = buscar_cliente_por_id(db, cliente_id)
    if not cliente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )
    return [producto_db_a_dict(p) for p in cliente_db.productos]


@app.delete("/api/clientes/{cliente_id}", response_model=EliminarResponse, tags=["Clientes"])
async def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Eliminación en dos fases:
      - Si el cliente está activo, se archiva (soft-delete, reversible).
      - Si ya estaba archivado, se borra definitivamente y se reindexan los ids.
    """
    cliente_db = buscar_cliente_por_id(db, cliente_id)
    if not cliente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    if not cliente_db.archivado:
        cliente_db.archivado = True
        db.commit()
        return {"accion": "archivado", "mensaje": "Cliente archivado"}

    # Ya estaba archivado → borrado definitivo + reindexado de ids.
    db.delete(cliente_db)
    db.commit()
    reindexar_clientes(db)
    db.commit()
    return {"accion": "eliminado", "mensaje": "Cliente eliminado definitivamente"}


@app.post("/api/clientes/{cliente_id}/restaurar", response_model=ClienteResponse, tags=["Clientes"])
async def restaurar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Revierte el archivado de un cliente (lo devuelve al listado activo)."""
    cliente_db = buscar_cliente_por_id(db, cliente_id)
    if not cliente_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )
    cliente_db.archivado = False
    db.commit()
    db.refresh(cliente_db)
    return {"cliente": cliente_db_a_dict(cliente_db)}


# --- Endpoints del modelo ---

class EvaluarPayload(BaseModel):
    edad: int = Field(..., ge=18, le=80)
    ingresos: float = Field(..., gt=0, le=500000000)
    estado_civil: int = Field(..., ge=0, le=1)
    deudas_existentes: float = Field(..., ge=0, le=1000000000)
    saldo_cuentas: float = Field(..., ge=0, le=1000000000)
    historial_pagos: float = Field(default=0.7, ge=0, le=1)
    tiempo_empleo: float = Field(default=2.0, ge=0, le=50)
    tipo_empleo: int = Field(default=1, ge=0, le=3)
    patrimonio: float = Field(..., ge=0, le=2_000_000_000)
    producto_solicitado: Optional[Literal["hipoteca", "prestamo", "credito", "debito"]] = None


def _evaluar(datos: EvaluarPayload) -> dict:
    prob = predecir_riesgo(
        datos.edad, datos.ingresos, datos.estado_civil,
        datos.deudas_existentes, datos.saldo_cuentas,
        datos.historial_pagos, datos.tiempo_empleo, datos.tipo_empleo,
        datos.patrimonio,
    )
    interpretacion = interpretar_resultado(
        prob, datos.ingresos, datos.deudas_existentes,
        datos.historial_pagos, datos.tiempo_empleo,
        producto_solicitado=datos.producto_solicitado,
        edad=datos.edad,
    )
    return {
        "probabilidad_riesgo": round(prob, 4),
        "credito_aprobado": prob < 0.5,
        "decision": "RECHAZADO" if prob >= 0.5 else "APROBADO",
        **interpretacion,
    }


@app.post("/api/evaluar", tags=["Créditos"])
async def evaluar(datos: EvaluarPayload):
    """Evaluacion sin persistencia — para el simulador del frontend."""
    resultado = _evaluar(datos)
    explicacion = explicar_riesgo(
        datos.edad, datos.ingresos, datos.estado_civil,
        datos.deudas_existentes, datos.saldo_cuentas,
        datos.historial_pagos, datos.tiempo_empleo, datos.tipo_empleo,
        datos.patrimonio,
    )
    resultado["explicacion"] = explicacion
    return resultado


@app.post("/api/que-mejorar", tags=["Créditos"])
async def que_mejorar(datos: EvaluarPayload):
    """Devuelve sugerencias concretas de que cambiar para pasar de rechazado a aprobado."""
    actual = _evaluar(datos)
    if actual["credito_aprobado"]:
        return {
            "probabilidad_actual": actual["probabilidad_riesgo"],
            "decision_actual": "APROBADO",
            "mensaje": "El crédito ya está aprobado.",
            "sugerencias": [],
        }

    base = datos.model_dump()
    sugerencias: list[dict] = []

    pruebas = [
        ("deudas_existentes", 0.5, "Reducir las deudas existentes a la mitad"),
        ("deudas_existentes", 0.2, "Reducir las deudas existentes en un 80%"),
        ("saldo_cuentas",     2.0, "Duplicar el saldo en cuentas"),
        ("patrimonio",        2.0, "Duplicar el patrimonio acumulado"),
        ("historial_pagos",   None, "Mejorar el historial de pagos al máximo"),
        ("tiempo_empleo",     None, "Acumular más antigüedad laboral (5+ años)"),
    ]

    valores_objetivo = {
        ("historial_pagos", None): 1.0,
        ("tiempo_empleo",   None): 5.0,
    }

    for campo, factor, accion in pruebas:
        modificado = dict(base)
        if factor is None:
            modificado[campo] = valores_objetivo[(campo, None)]
        else:
            modificado[campo] = base[campo] * factor

        prueba = EvaluarPayload(**modificado)
        prob = predecir_riesgo(
            prueba.edad, prueba.ingresos, prueba.estado_civil,
            prueba.deudas_existentes, prueba.saldo_cuentas,
            prueba.historial_pagos, prueba.tiempo_empleo, prueba.tipo_empleo,
            prueba.patrimonio,
        )
        if prob < 0.5:
            sugerencias.append({
                "campo": campo,
                "accion": accion,
                "valor_propuesto": round(modificado[campo], 4),
                "nueva_probabilidad": round(prob, 4),
            })

    return {
        "probabilidad_actual": actual["probabilidad_riesgo"],
        "decision_actual": "RECHAZADO",
        "sugerencias": sugerencias,
    }


@app.get("/api/modelo/metricas", tags=["Modelo"])
async def obtener_metricas_modelo():
    """Metricas de evaluacion del modelo en el conjunto de validacion."""
    ruta = BASE_DIR / "modelo" / "metricas.json"
    if not ruta.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay métricas guardadas. Re-entrena el modelo con modelo/entrenar.py",
        )
    with open(ruta) as f:
        return json.load(f)


@app.get("/api/modelo/info", tags=["Modelo"])
async def obtener_info_modelo():
    """Informacion descriptiva del modelo (arquitectura, features, normalizacion)."""
    return {
        "n_features": N_FEATURES,
        "nombres_features": NOMBRES_FEATURES,
        "shap_disponible": _shap_disponible,
        "umbral_decision": 0.5,
        "niveles_riesgo": NIVELES,
    }


# --- Frontend SPA (SvelteKit build estatico) ---
# Las rutas /api/* ya estan registradas arriba; este bloque sirve cualquier
# otra ruta desde el build estatico del frontend.

if FRONTEND_BUILD.exists():
    # Assets generados por SvelteKit (JS, CSS, fuentes) bajo /_app/...
    app.mount(
        "/_app",
        StaticFiles(directory=str(FRONTEND_BUILD / "_app")),
        name="spa_assets",
    )

    INDEX_HTML = FRONTEND_BUILD / "index.html"

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        # Si el path apunta a un archivo del build (favicon.svg, etc.), servirlo.
        if full_path:
            archivo = (FRONTEND_BUILD / full_path).resolve()
            try:
                archivo.relative_to(FRONTEND_BUILD.resolve())
            except ValueError:
                # Path traversal — devolver el shell.
                return FileResponse(INDEX_HTML)
            if archivo.is_file():
                return FileResponse(archivo)
        # Fallback SPA: cualquier otra ruta devuelve el shell de SvelteKit.
        return FileResponse(INDEX_HTML)

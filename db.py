"""Capa de persistencia con SQLite + SQLAlchemy.

El proyecto era una BD en memoria (lista de dicts). Ahora los clientes y
productos viven en `bancat.db` (SQLite local) — sobreviven reinicios sin
cambiar nada del stack ni de los endpoints.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterator, Optional

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text, create_engine
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    Session,
    mapped_column,
    relationship,
    sessionmaker,
)

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "bancat.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# check_same_thread=False permite que FastAPI use la conexión desde el threadpool
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class ClienteDB(Base):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Datos del perfil
    nombre: Mapped[str] = mapped_column(String(255))
    correo: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    edad: Mapped[int] = mapped_column(Integer)
    ingresos: Mapped[float] = mapped_column(Float)
    estado_civil: Mapped[int] = mapped_column(Integer)
    deudas_existentes: Mapped[float] = mapped_column(Float)
    saldo_cuentas: Mapped[float] = mapped_column(Float)
    historial_pagos: Mapped[float] = mapped_column(Float)
    tiempo_empleo: Mapped[float] = mapped_column(Float)
    tipo_empleo: Mapped[int] = mapped_column(Integer)
    patrimonio: Mapped[float] = mapped_column(Float)
    producto_solicitado: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    # Soft-delete: un cliente "archivado" sigue en la BD pero se oculta del
    # listado activo. El borrado definitivo solo ocurre al eliminar un archivado.
    archivado: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Outputs del modelo (se persisten para no recalcular en cada listado)
    probabilidad_riesgo: Mapped[float] = mapped_column(Float)
    credito_aprobado: Mapped[bool] = mapped_column(Boolean)
    nivel_riesgo: Mapped[str] = mapped_column(String(20))
    riesgo_porcentaje: Mapped[float] = mapped_column(Float)
    monto_maximo: Mapped[float] = mapped_column(Float)
    tasa_sugerida: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    producto_recomendado_json: Mapped[str] = mapped_column(Text)
    producto_solicitado_evaluacion_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    explicacion_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    productos: Mapped[list["ProductoBancarioDB"]] = relationship(
        "ProductoBancarioDB",
        back_populates="cliente",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ProductoBancarioDB(Base):
    __tablename__ = "productos_bancarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    cliente_id: Mapped[int] = mapped_column(
        ForeignKey("clientes.id", ondelete="CASCADE"), index=True
    )
    tipo: Mapped[str] = mapped_column(String(20))
    nombre: Mapped[str] = mapped_column(String(255))
    numero_producto: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    # Campos propios del tipo (saldo, cupo_credito, monto_desembolsado, etc.) en JSON
    data_json: Mapped[str] = mapped_column(Text, default="{}")

    cliente: Mapped["ClienteDB"] = relationship("ClienteDB", back_populates="productos")


# --- Helpers de serializacion ---

_CAMPOS_PRODUCTO_BASE = {"tipo", "nombre", "numero_producto", "activo"}


def producto_db_a_dict(producto: ProductoBancarioDB) -> dict:
    """Reconstruye el dict completo del producto (base + campos específicos)."""
    extras = json.loads(producto.data_json) if producto.data_json else {}
    return {
        "tipo": producto.tipo,
        "nombre": producto.nombre,
        "numero_producto": producto.numero_producto,
        "activo": producto.activo,
        **extras,
    }


def producto_dict_a_db(payload: dict, cliente_id: int) -> ProductoBancarioDB:
    """Crea un registro ORM a partir del dict que produce Pydantic."""
    extras = {k: v for k, v in payload.items() if k not in _CAMPOS_PRODUCTO_BASE}
    return ProductoBancarioDB(
        cliente_id=cliente_id,
        tipo=payload["tipo"],
        nombre=payload["nombre"],
        numero_producto=payload["numero_producto"],
        activo=payload.get("activo", True),
        data_json=json.dumps(extras),
    )


def cliente_db_a_dict(cliente: ClienteDB) -> dict:
    """Aplana el ORM al mismo dict que esperaba el código en memoria."""
    # Derivado en lectura: capacidad de pago mensual = 30% de ingresos
    # menos la cuota mensual de las deudas existentes (asume plazo 60 meses).
    # Los creditos hipotecarios NO se contabilizan aqui — el formulario
    # explicitamente pide que el usuario solo declare deudas de consumo.
    capacidad_pago = max(cliente.ingresos * 0.30 - cliente.deudas_existentes / 60, 0)

    return {
        "id": cliente.id,
        "nombre": cliente.nombre,
        "correo": cliente.correo,
        "edad": cliente.edad,
        "ingresos": cliente.ingresos,
        "estado_civil": cliente.estado_civil,
        "deudas_existentes": cliente.deudas_existentes,
        "saldo_cuentas": cliente.saldo_cuentas,
        "historial_pagos": cliente.historial_pagos,
        "tiempo_empleo": cliente.tiempo_empleo,
        "tipo_empleo": cliente.tipo_empleo,
        "patrimonio": cliente.patrimonio,
        "producto_solicitado": cliente.producto_solicitado,
        "archivado": cliente.archivado,
        "productos": [producto_db_a_dict(p) for p in cliente.productos],
        "probabilidad_riesgo": cliente.probabilidad_riesgo,
        "credito_aprobado": cliente.credito_aprobado,
        "nivel_riesgo": cliente.nivel_riesgo,
        "riesgo_porcentaje": cliente.riesgo_porcentaje,
        "monto_maximo": cliente.monto_maximo,
        "tasa_sugerida": cliente.tasa_sugerida,
        "capacidad_pago_mensual": round(capacidad_pago),
        "producto_recomendado": json.loads(cliente.producto_recomendado_json),
        "producto_solicitado_evaluacion": (
            json.loads(cliente.producto_solicitado_evaluacion_json)
            if cliente.producto_solicitado_evaluacion_json
            else None
        ),
        "explicacion": (
            json.loads(cliente.explicacion_json) if cliente.explicacion_json else None
        ),
    }


def init_db() -> None:
    """Crea las tablas si no existen. Idempotente."""
    Base.metadata.create_all(bind=engine)


def reindexar_clientes(db: Session) -> None:
    """Reasigna ids secuenciales (1..N) a los clientes tras un borrado definitivo,
    propagando el cambio a los productos hijos.

    Estrategia en dos fases con un desplazamiento grande para evitar colisiones
    de clave primaria mientras se reasignan los ids:
      1. Se mueve todo a un rango alto (id + OFFSET).
      2. Se reasigna 1..N leyendo en orden ascendente.

    El siguiente autoincrement queda en N+1 automáticamente (INTEGER PRIMARY KEY
    usa max(rowid)+1), así que no hace falta tocar sqlite_sequence.
    """
    from sqlalchemy import text

    OFFSET = 1_000_000

    filas = db.execute(text("SELECT id FROM clientes ORDER BY id")).fetchall()
    ids_actuales = [fila[0] for fila in filas]
    # Si ya están en 1..N consecutivos, no hay nada que reindexar.
    if ids_actuales == list(range(1, len(ids_actuales) + 1)):
        return

    # Fase 1: desplazar fuera del rango objetivo.
    db.execute(text("UPDATE productos_bancarios SET cliente_id = cliente_id + :o"), {"o": OFFSET})
    db.execute(text("UPDATE clientes SET id = id + :o"), {"o": OFFSET})

    # Fase 2: reasignar secuencialmente.
    for nuevo_id, viejo_id in enumerate(ids_actuales, start=1):
        viejo_desplazado = viejo_id + OFFSET
        db.execute(
            text("UPDATE clientes SET id = :n WHERE id = :v"),
            {"n": nuevo_id, "v": viejo_desplazado},
        )
        db.execute(
            text("UPDATE productos_bancarios SET cliente_id = :n WHERE cliente_id = :v"),
            {"n": nuevo_id, "v": viejo_desplazado},
        )

    # El ORM tiene en su identity map los ids viejos; invalidarlos.
    db.expire_all()


def get_db() -> Iterator[Session]:
    """Dependency de FastAPI: una sesión por request, cerrada al terminar."""
    sesion = SessionLocal()
    try:
        yield sesion
    finally:
        sesion.close()

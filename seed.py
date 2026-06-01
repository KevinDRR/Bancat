"""Poblador de la base de datos con clientes mock coherentes y realistas.

Inserta 50 clientes con perfiles variados (empleados, independientes, informales,
pensionados), distintos niveles de riesgo y distintos productos solicitados. Cada
cliente se procesa con `crear_cliente`, así que el scoring (riesgo, monto, tasa,
producto recomendado, SHAP) lo calcula el modelo real — los datos no están
"hardcodeados", emergen del mismo pipeline que usa la app.

Uso:
    python seed.py            # resetea la BD y la puebla desde cero
    python seed.py --append   # agrega sobre lo existente (omite correos repetidos)

Los valores monetarios están en COP y calibrados sobre el mercado colombiano
(SMMLV 2026 ~ $1.650.000). La coherencia interna se respeta:
  - tiempo_empleo <= edad - 18
  - patrimonio y saldo correlacionados con ingresos
  - deudas y historial determinan el nivel de riesgo resultante
"""

from __future__ import annotations

import sys

from db import Base, SessionLocal, engine
from main import ClienteNuevo, buscar_cliente_por_correo, crear_cliente


# Cada cliente declara, además de su perfil, qué productos bancarios YA posee
# (lista de tipos). El script construye los registros con números únicos y montos
# derivados de sus ingresos, para que sean coherentes con el perfil.
CLIENTES = [
    # nombre, correo, edad, ingresos, estado_civil, deudas, saldo, historial,
    # t_empleo, tipo_empleo, patrimonio, producto_solicitado, [productos_que_tiene]
    ("Valentina Ríos",      "valentina.rios@gmail.com",   34,  8_500_000, 1,  1_200_000, 12_000_000, 0.92,  8, 1,  95_000_000, "hipoteca", ["debito", "credito"]),
    ("Andrés Mejía",        "andres.mejia@outlook.com",   41, 12_000_000, 1,  3_000_000, 25_000_000, 0.88, 15, 1, 180_000_000, "hipoteca", ["debito", "hipoteca"]),
    ("Camila Torres",       "camila.torres@gmail.com",    28,  6_000_000, 0,  4_500_000,  7_000_000, 0.66,  5, 2,  18_000_000, "prestamo", ["debito", "credito"]),
    ("Sebastián Gómez",     "sebastian.gomez@hotmail.com",62,  4_500_000, 1,    500_000, 18_000_000, 0.95, 25, 3, 120_000_000, "prestamo", ["debito"]),
    ("Daniela Castro",      "daniela.castro@gmail.com",   23,  2_800_000, 0,  2_400_000,  2_000_000, 0.64,  2, 1,   8_000_000, "credito",  ["debito"]),
    ("Juan Pablo Vega",     "juanp.vega@gmail.com",       37,  1_800_000, 1,  4_500_000,    500_000, 0.34,  6, 0,   5_000_000, "credito",  ["debito"]),
    ("Mariana López",       "mariana.lopez@outlook.com",  45, 18_000_000, 1,  5_000_000, 40_000_000, 0.90, 20, 2, 350_000_000, "hipoteca", ["debito", "credito", "hipoteca"]),
    ("Felipe Ramírez",      "felipe.ramirez@gmail.com",   30,  5_000_000, 0,  8_000_000,  1_000_000, 0.55,  4, 1,  12_000_000, "prestamo", ["debito", "credito", "prestamo"]),
    ("Laura Jiménez",       "laura.jimenez@hotmail.com",  26,  3_500_000, 0,  1_000_000,  4_000_000, 0.82,  3, 1,  15_000_000, "credito",  ["debito"]),
    ("Carlos Andrés Ruiz",  "carlos.ruiz@gmail.com",      58,  6_000_000, 1,  1_000_000, 30_000_000, 0.96, 30, 3, 200_000_000, "prestamo", ["debito", "prestamo"]),
    ("Sofía Herrera",       "sofia.herrera@gmail.com",    33,  9_000_000, 0,  9_000_000,  6_000_000, 0.62,  7, 2,  24_000_000, "prestamo", ["debito", "credito"]),
    ("Diego Morales",       "diego.morales@outlook.com",  29,  2_200_000, 0,  3_500_000,    800_000, 0.42,  3, 0,   3_500_000, "credito",  ["debito"]),
    ("Natalia Vargas",      "natalia.vargas@gmail.com",   38,  7_000_000, 1,  2_000_000, 15_000_000, 0.87, 12, 1,  90_000_000, "hipoteca", ["debito", "credito"]),
    ("Esteban Cardona",     "esteban.cardona@gmail.com",  47, 15_000_000, 1, 19_000_000, 12_000_000, 0.63, 18, 2,  90_000_000, "hipoteca", ["debito", "credito", "hipoteca"]),
    ("Paula Restrepo",      "paula.restrepo@hotmail.com", 24,  2_500_000, 0,    500_000,  3_000_000, 0.78,  2, 1,   7_000_000, "debito",   ["debito"]),
    ("Ricardo Núñez",       "ricardo.nunez@gmail.com",    35,  1_600_000, 1,  4_000_000,    300_000, 0.38,  5, 0,   3_000_000, "credito",  ["debito"]),
    ("Ana María Salazar",   "anamaria.salazar@gmail.com", 42, 10_000_000, 1,  2_500_000, 28_000_000, 0.91, 16, 1, 160_000_000, "hipoteca", ["debito", "credito", "hipoteca"]),
    ("Tomás Aguirre",       "tomas.aguirre@outlook.com",  31,  5_500_000, 0,  6_500_000,  6_000_000, 0.60,  6, 2,  11_000_000, "prestamo", ["debito", "credito"]),
    ("Isabella Mendoza",    "isabella.mendoza@gmail.com", 27,  4_000_000, 0,  1_200_000,  5_000_000, 0.80,  4, 1,  18_000_000, "credito",  ["debito", "credito"]),
    ("Gabriel Ortiz",       "gabriel.ortiz@hotmail.com",  55,  5_000_000, 1,    800_000, 22_000_000, 0.94, 28, 3, 140_000_000, "prestamo", ["debito"]),
    ("Valeria Cárdenas",    "valeria.cardenas@gmail.com", 39, 11_000_000, 1, 14_000_000,  8_000_000, 0.60, 10, 2,  30_000_000, "hipoteca", ["debito", "credito"]),
    ("Mateo Guzmán",        "mateo.guzman@gmail.com",     22,  1_400_000, 0,  2_200_000,    400_000, 0.44,  2, 0,   2_000_000, "debito",   ["debito"]),
    ("Laura Beltrán",       "laura.beltran@gmail.com",    31,  4_500_000, 0,  2_000_000,  5_000_000, 0.80,  5, 1,  20_000_000, "credito",  ["debito", "credito"]),
    ("Óscar Patiño",        "oscar.patino@outlook.com",   44, 13_000_000, 1, 11_000_000,  9_000_000, 0.62, 16, 2,  70_000_000, "hipoteca", ["debito", "credito"]),
    ("Carolina Ospina",     "carolina.ospina@gmail.com",  29,  5_000_000, 0,  1_500_000,  6_000_000, 0.85,  4, 1,  22_000_000, "prestamo", ["debito"]),
    ("Hernán Gutiérrez",    "hernan.gutierrez@gmail.com", 38,  1_900_000, 1,  3_800_000,    600_000, 0.40,  8, 0,   4_000_000, "credito",  ["debito"]),
    ("Lina Marcela Díaz",   "lina.diaz@hotmail.com",      26,  3_200_000, 0,  1_000_000,  3_500_000, 0.79,  3, 1,  12_000_000, "credito",  ["debito"]),
    ("Julián Castaño",      "julian.castano@gmail.com",   49, 16_000_000, 1,  7_000_000, 25_000_000, 0.78, 22, 2, 280_000_000, "hipoteca", ["debito", "credito", "hipoteca"]),
    ("Adriana Rojas",       "adriana.rojas@gmail.com",    35,  6_500_000, 1,  2_500_000, 10_000_000, 0.83, 10, 1,  55_000_000, "hipoteca", ["debito", "credito"]),
    ("Wilson Pérez",        "wilson.perez@outlook.com",   41,  2_400_000, 1,  4_500_000,    700_000, 0.48, 12, 0,   7_000_000, "credito",  ["debito"]),
    ("Manuela Arango",      "manuela.arango@gmail.com",   24,  2_600_000, 0,    800_000,  2_500_000, 0.75,  2, 1,   6_000_000, "debito",   ["debito"]),
    ("Fernando Quintero",   "fernando.quintero@gmail.com",60,  5_500_000, 1,    900_000, 28_000_000, 0.95, 32, 3, 180_000_000, "prestamo", ["debito", "prestamo"]),
    ("Paola Andrea Suárez", "paola.suarez@hotmail.com",   33,  8_000_000, 0,  7_500_000,  6_000_000, 0.60,  7, 2,  22_000_000, "prestamo", ["debito", "credito"]),
    ("Andrés Felipe Cano",  "andres.cano@gmail.com",      28,  4_800_000, 0,  6_000_000,  1_500_000, 0.55,  4, 1,  10_000_000, "prestamo", ["debito", "credito"]),
    ("Catalina Vélez",      "catalina.velez@gmail.com",   37,  9_500_000, 1,  3_000_000, 18_000_000, 0.89, 13, 1, 110_000_000, "hipoteca", ["debito", "credito", "hipoteca"]),
    ("Mauricio Londoño",    "mauricio.londono@outlook.com",46,14_000_000, 1, 13_000_000, 11_000_000, 0.63, 19, 2,  60_000_000, "hipoteca", ["debito", "credito"]),
    ("Daniela Ramírez",     "daniela.ramirez@gmail.com",  25,  3_000_000, 0,  1_200_000,  3_000_000, 0.77,  3, 1,   9_000_000, "credito",  ["debito"]),
    ("Jorge Iván Marín",    "jorge.marin@gmail.com",      53,  4_800_000, 1,  1_200_000, 16_000_000, 0.93, 26, 3, 130_000_000, "prestamo", ["debito"]),
    ("Verónica Acosta",     "veronica.acosta@hotmail.com",32,  7_500_000, 0,  5_000_000,  7_000_000, 0.70,  8, 2,  35_000_000, "prestamo", ["debito", "credito"]),
    ("Santiago Hoyos",      "santiago.hoyos@gmail.com",   30,  2_100_000, 0,  3_200_000,    500_000, 0.46,  5, 0,   4_000_000, "credito",  ["debito"]),
    ("Ángela Naranjo",      "angela.naranjo@gmail.com",   39,  7_000_000, 1,  2_800_000, 14_000_000, 0.86, 14, 1,  85_000_000, "hipoteca", ["debito", "credito"]),
    ("Ricardo Mejía",       "ricardo.mejia@outlook.com",  43, 12_000_000, 1, 14_000_000,  8_000_000, 0.58, 17, 2,  45_000_000, "hipoteca", ["debito", "credito"]),
    ("Sara Gómez",          "sara.gomez@gmail.com",       27,  4_200_000, 0,  1_300_000,  4_500_000, 0.81,  4, 1,  16_000_000, "credito",  ["debito", "credito"]),
    ("Camilo Restrepo",     "camilo.restrepo@gmail.com",  34,  5_800_000, 1,  7_000_000,  2_000_000, 0.57,  6, 1,  14_000_000, "prestamo", ["debito", "credito"]),
    ("Natalia Ríos",        "natalia.rios@hotmail.com",   36, 10_000_000, 1,  5_500_000, 13_000_000, 0.74, 11, 2,  70_000_000, "hipoteca", ["debito", "credito"]),
    ("Eduardo Vargas",      "eduardo.vargas@gmail.com",   57,  6_200_000, 1,  1_000_000, 32_000_000, 0.96, 30, 3, 210_000_000, "prestamo", ["debito", "prestamo"]),
    ("Juliana Mejía",       "juliana.mejia@gmail.com",    23,  2_400_000, 0,  2_000_000,  1_800_000, 0.63,  2, 1,   5_000_000, "credito",  ["debito"]),
    ("Iván Darío Gómez",    "ivan.gomez@outlook.com",     40,  2_600_000, 1,  5_000_000,    900_000, 0.50, 14, 0,   8_000_000, "credito",  ["debito"]),
    ("Marcela Toro",        "marcela.toro@gmail.com",     31,  6_000_000, 0,  2_200_000,  8_000_000, 0.84,  7, 1,  40_000_000, "hipoteca", ["debito", "credito"]),
    ("Alejandro Pineda",    "alejandro.pineda@gmail.com", 48, 17_000_000, 1,  9_000_000, 22_000_000, 0.80, 20, 2, 300_000_000, "hipoteca", ["debito", "credito", "hipoteca"]),
]


# Contadores globales para garantizar números de producto únicos.
_PREFIJO = {"debito": "CTA", "credito": "TC", "prestamo": "PR", "hipoteca": "HP"}
_secuencia = {"debito": 1000, "credito": 2000, "prestamo": 3000, "hipoteca": 4000}


def _siguiente_numero(tipo: str) -> str:
    _secuencia[tipo] += 1
    return f"{_PREFIJO[tipo]}-{_secuencia[tipo]}"


def _construir_producto(tipo: str, ingresos: int) -> dict:
    """Crea un producto bancario con montos coherentes respecto a los ingresos."""
    numero = _siguiente_numero(tipo)
    if tipo == "debito":
        return {
            "tipo": "debito",
            "nombre": "Cuenta de Ahorros",
            "numero_producto": numero,
            "activo": True,
            "saldo": round(ingresos * 1.5),
        }
    if tipo == "credito":
        cupo = min(round(ingresos * 2.5), 300_000_000)
        return {
            "tipo": "credito",
            "nombre": "Tarjeta de Crédito",
            "numero_producto": numero,
            "activo": True,
            "cupo_credito": cupo,
            "saldo_utilizado": round(cupo * 0.3),
            "tasa_interes_anual": 26.0,
        }
    if tipo == "prestamo":
        monto = round(ingresos * 10)
        return {
            "tipo": "prestamo",
            "nombre": "Préstamo de Libre Inversión",
            "numero_producto": numero,
            "activo": True,
            "monto_desembolsado": monto,
            "saldo_pendiente": round(monto * 0.6),
            "plazo_meses": 60,
            "tasa_interes_anual": 20.0,
        }
    if tipo == "hipoteca":
        monto = round(ingresos * 40)
        return {
            "tipo": "hipoteca",
            "nombre": "Crédito Hipotecario",
            "numero_producto": numero,
            "activo": True,
            "monto_desembolsado": monto,
            "saldo_pendiente": round(monto * 0.75),
            "plazo_meses": 180,
            "tasa_interes_anual": 12.0,
        }
    raise ValueError(f"Tipo de producto desconocido: {tipo}")


def poblar(append: bool = False) -> None:
    if not append:
        print("Reseteando la base de datos…")
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    creados = 0
    omitidos = 0
    try:
        for fila in CLIENTES:
            (nombre, correo, edad, ingresos, estado_civil, deudas, saldo, historial,
             t_empleo, tipo_empleo, patrimonio, producto_solicitado, tiene) = fila

            if append and buscar_cliente_por_correo(db, correo):
                omitidos += 1
                continue

            productos = [_construir_producto(t, ingresos) for t in tiene]

            datos = ClienteNuevo(
                nombre=nombre,
                correo=correo,
                edad=edad,
                ingresos=ingresos,
                estado_civil=estado_civil,
                deudas_existentes=deudas,
                saldo_cuentas=saldo,
                historial_pagos=historial,
                tiempo_empleo=t_empleo,
                tipo_empleo=tipo_empleo,
                patrimonio=patrimonio,
                producto_solicitado=producto_solicitado,
                productos=productos,
            )
            cliente = crear_cliente(db, datos)
            creados += 1
            decision = "APROBADO" if cliente["credito_aprobado"] else "RECHAZADO"
            print(
                f"  #{cliente['id']:>2}  {nombre:<22} "
                f"riesgo={cliente['nivel_riesgo']:<9} {decision:<9} "
                f"rec={cliente['producto_recomendado']['nombre']}"
            )
    finally:
        db.close()

    print(f"\nListo: {creados} clientes creados" + (f", {omitidos} omitidos (ya existían)" if omitidos else "") + ".")


if __name__ == "__main__":
    poblar(append="--append" in sys.argv)

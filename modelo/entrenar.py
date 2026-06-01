import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import json
from sklearn.metrics import roc_auc_score, confusion_matrix

np.random.seed(42)
torch.manual_seed(42)

# ============================================================================
# Generacion de datos sinteticos realistas
# ----------------------------------------------------------------------------
# Modelo de poblacion bancaria colombiana basado en:
#   - Distribuciones segmentadas por tipo_empleo (informal / empleado /
#     independiente / pensionado), cada segmento con sus propios parametros.
#   - Correlaciones realistas entre edad, antiguedad, ingresos y patrimonio.
#   - Etiquetado probabilistico (Probability of Default) en lugar de threshold
#     deterministico: cada cliente tiene un PD intrinseco; la etiqueta default
#     se obtiene como Bernoulli(PD), igual que en literatura de credit scoring.
#   - Coeficientes calibrados para reproducir las morosidades observadas en
#     cartera de consumo colombiana (5-12% segun segmento).
# ============================================================================

print("\nGenerando datos...")

N_MUESTRAS = 6000
rng = np.random.default_rng(42)

# Mezcla de la poblacion (Superfinanciera 2023: ~46% empleo formal, 47% informal,
# resto independientes + pensionados).
MEZCLA_EMPLEO = {
    0: 0.42,  # informal
    1: 0.38,  # empleado
    2: 0.13,  # independiente
    3: 0.07,  # pensionado
}

# Asignar tipo de empleo a cada cliente
tipo_empleo = rng.choice(
    [0, 1, 2, 3], size=N_MUESTRAS,
    p=[MEZCLA_EMPLEO[k] for k in [0, 1, 2, 3]],
).astype(float)


def generar_segmento(mascara, params, rng):
    """Genera features correlacionadas para un sub-segmento."""
    n = int(mascara.sum())
    if n == 0:
        return None

    # Edad: distribucion segun segmento
    edad_min, edad_max, edad_mu = params["edad"]
    edad = np.clip(
        rng.normal(edad_mu, (edad_max - edad_min) / 5, n),
        edad_min, edad_max,
    )

    # Ingresos: lognormal segun segmento
    ing_mu, ing_sigma, ing_min, ing_max = params["ingresos"]
    ingresos = rng.lognormal(ing_mu, ing_sigma, n).clip(ing_min, ing_max)

    # Antiguedad: correlacionada con edad (no puedes tener 30 anios de empleo a los 25)
    # Modelo: tiempo_empleo = min(edad - edad_inicial, exponencial)
    edad_inicio_laboral = 18 if params["tipo"] != 3 else 20
    max_posible = np.maximum(edad - edad_inicio_laboral, 0)
    if params["tipo"] == 3:  # pensionado: muchos anios cotizados
        tiempo_base = rng.normal(25, 8, n)
    else:
        tiempo_base = rng.exponential(params["tiempo_escala"], n)
    tiempo_empleo = np.clip(tiempo_base, 0, max_posible).clip(0, 45)

    # Historial de pagos: beta segun segmento (los informales tienden a peor historial)
    a_hist, b_hist = params["historial_beta"]
    historial_pagos = rng.beta(a_hist, b_hist, n)

    # Patrimonio: correlacionado positivamente con edad e ingresos
    # log(patrimonio) ~ N(base + 0.3*log(ingresos) + 0.02*edad, sigma)
    log_patrimonio = (
        params["patrimonio_base"]
        + 0.5 * np.log(ingresos / 1_000_000)
        + 0.04 * (edad - 30)
        + rng.normal(0, params["patrimonio_sigma"], n)
    )
    patrimonio = np.exp(log_patrimonio).clip(0, 2_000_000_000)

    # Saldo en cuentas: correlacionado con ingresos y patrimonio
    # Tipicamente 0.5-3 meses de ingresos para empleados, menos para informales
    factor_liquidez = params["liquidez_factor"]
    saldo_base = ingresos * rng.lognormal(np.log(factor_liquidez), 0.8, n)
    # Refuerzo por patrimonio (gente con patrimonio tiene mas liquidez)
    saldo_cuentas = (saldo_base + 0.01 * patrimonio * rng.beta(1, 4, n)).clip(0, 100_000_000)

    # Deudas existentes: correlacionadas con ingresos (mas ingresos = mas credito)
    # pero con cola pesada (algunos clientes sobre-endeudados)
    factor_deuda = rng.exponential(params["deuda_factor"], n)
    deudas_existentes = (ingresos * factor_deuda).clip(0, 80_000_000)

    # Estado civil: probabilidad creciente con edad
    p_casado = np.clip(0.15 + 0.012 * (edad - 25), 0.1, 0.75)
    estado_civil = rng.binomial(1, p_casado).astype(float)

    return {
        "edad": edad,
        "ingresos": ingresos,
        "estado_civil": estado_civil,
        "deudas_existentes": deudas_existentes,
        "saldo_cuentas": saldo_cuentas,
        "historial_pagos": historial_pagos,
        "tiempo_empleo": tiempo_empleo,
        "patrimonio": patrimonio,
        "mascara": mascara,
    }


# Parametros por segmento (calibrados con rangos tipicos del mercado bancario
# colombiano). Los deuda_factor estan ajustados al acceso real al credito:
# informales tienen menos credito formal, empleados son los mas endeudados.
PARAMS_SEGMENTO = {
    0: {  # INFORMAL: ingresos bajos, sin estabilidad, historial irregular
        "tipo": 0,
        "edad": (20, 60, 35),
        "ingresos": (14.0, 0.45, 800_000, 4_000_000),
        "tiempo_escala": 2.5,
        "historial_beta": (3.5, 3.0),     # mas centrado: muchos con historial decente
        "patrimonio_base": 13.5,
        "patrimonio_sigma": 1.3,
        "liquidez_factor": 0.25,
        "deuda_factor": 0.25,             # poco acceso a credito formal
    },
    1: {  # EMPLEADO formal: ingresos estables, buen historial, mas credito
        "tipo": 1,
        "edad": (22, 65, 38),
        "ingresos": (14.9, 0.55, 1_500_000, 18_000_000),
        "tiempo_escala": 6.0,
        "historial_beta": (7.0, 1.8),     # historial generalmente bueno
        "patrimonio_base": 15.0,
        "patrimonio_sigma": 1.1,
        "liquidez_factor": 1.2,
        "deuda_factor": 0.7,              # endeudamiento moderado tipico
    },
    2: {  # INDEPENDIENTE: ingresos altos pero variables, patrimonio fuerte
        "tipo": 2,
        "edad": (25, 70, 42),
        "ingresos": (15.4, 0.7, 2_000_000, 30_000_000),
        "tiempo_escala": 9.0,
        "historial_beta": (5.5, 2.2),
        "patrimonio_base": 15.8,
        "patrimonio_sigma": 1.4,
        "liquidez_factor": 2.5,
        "deuda_factor": 1.0,
    },
    3: {  # PENSIONADO: ingresos modestos pero estabilisimos, excelente historial
        "tipo": 3,
        "edad": (60, 80, 68),
        "ingresos": (14.7, 0.35, 1_700_000, 8_000_000),
        "tiempo_escala": 20.0,
        "historial_beta": (9.0, 1.3),
        "patrimonio_base": 16.0,
        "patrimonio_sigma": 1.0,
        "liquidez_factor": 1.8,
        "deuda_factor": 0.3,
    },
}

# Generar cada segmento por separado y combinar
segmentos = []
for tipo, params in PARAMS_SEGMENTO.items():
    mascara = tipo_empleo == tipo
    seg = generar_segmento(mascara, params, rng)
    if seg is not None:
        segmentos.append((tipo, seg))

# Reconstruir arrays en orden original
edad = np.zeros(N_MUESTRAS)
ingresos = np.zeros(N_MUESTRAS)
estado_civil = np.zeros(N_MUESTRAS)
deudas_existentes = np.zeros(N_MUESTRAS)
saldo_cuentas = np.zeros(N_MUESTRAS)
historial_pagos = np.zeros(N_MUESTRAS)
tiempo_empleo = np.zeros(N_MUESTRAS)
patrimonio = np.zeros(N_MUESTRAS)

for tipo, seg in segmentos:
    mascara = seg["mascara"]
    edad[mascara] = seg["edad"]
    ingresos[mascara] = seg["ingresos"]
    estado_civil[mascara] = seg["estado_civil"]
    deudas_existentes[mascara] = seg["deudas_existentes"]
    saldo_cuentas[mascara] = seg["saldo_cuentas"]
    historial_pagos[mascara] = seg["historial_pagos"]
    tiempo_empleo[mascara] = seg["tiempo_empleo"]
    patrimonio[mascara] = seg["patrimonio"]

relacion_deuda_ingreso = (deudas_existentes / np.maximum(ingresos, 1)).clip(0, 60)

# ============================================================================
# Etiquetado probabilistico (Probability of Default)
# ----------------------------------------------------------------------------
# Modelo logit calibrado para reproducir morosidad real:
#   PD = sigmoid(beta0 + sum(beta_i * x_i) + interacciones + ruido)
#   default ~ Bernoulli(PD)
# Esto crea labels stocasticos (no deterministicos) que es como funciona el
# credit scoring real. Un cliente con PD=0.3 puede no caer en default, y otro
# con PD=0.1 podria caer — captura la incertidumbre intrinseca.
# ============================================================================

# Capacidad de pago: % del ingreso disponible despues de servicio de deudas existentes
# Asumimos que las deudas existentes se pagan en cuotas a 60 meses (5 anios)
cuota_estimada_actual = deudas_existentes / 60
capacidad_pago = np.clip((ingresos - cuota_estimada_actual) / np.maximum(ingresos, 1), -1, 1)

# Score crediticio simulado tipo Datacredito (rango 150-950, mejor > 730)
# Correlacionado con historial, antiguedad y patrimonio
score_base = (
    300
    + 400 * historial_pagos
    + 80 * np.clip(tiempo_empleo / 10, 0, 1.5)
    + 80 * np.clip(np.log10(patrimonio + 1) / 9, 0, 1)
    - 40 * np.clip(relacion_deuda_ingreso, 0, 2)
)
score_crediticio = np.clip(score_base + rng.normal(0, 40, N_MUESTRAS), 150, 950)

# Factor de score: -1 (excelente) a +1 (muy malo)
factor_score = np.clip((730 - score_crediticio) / 250, -1.5, 1.5)

# Construccion del logit de PD
# Coeficientes calibrados para reproducir morosidad real de cartera de consumo
# colombiana (~5-12% overall, mayor en informales/jovenes, menor en pensionados).
logit_pd = (
    -3.6  # intercepto: tasa base de default ~3% para el cliente "promedio bueno"
    # Factor 1: Endeudamiento (predictor mas fuerte, lineal con tope)
    + 1.2 * np.clip(relacion_deuda_ingreso, 0, 3)
    # Factor 2: Historial de pagos
    + 2.8 * (1 - historial_pagos)
    # Factor 3: Score crediticio derivado
    + 1.0 * factor_score
    # Factor 4: Ingresos muy bajos
    + 0.6 * (ingresos < 1_500_000).astype(float)
    + 0.3 * ((ingresos >= 1_500_000) & (ingresos < 2_500_000)).astype(float)
    # Factor 5: Antiguedad laboral baja
    + 0.4 * (tiempo_empleo < 1.0).astype(float)
    + 0.15 * ((tiempo_empleo >= 1.0) & (tiempo_empleo < 3.0)).astype(float)
    # Factor 6: Tipo de empleo
    + 0.55 * (tipo_empleo == 0).astype(float)   # informal (mayor riesgo)
    + 0.05 * (tipo_empleo == 2).astype(float)   # independiente (ligeramente mayor)
    - 0.7 * (tipo_empleo == 3).astype(float)    # pensionado (mucho mas estable)
    # Factor 7: Liquidez baja
    + 0.35 * (saldo_cuentas < 500_000).astype(float)
    # Factor 8: Patrimonio como buffer (a mas patrimonio, menos riesgo)
    - 0.55 * np.clip(np.log10(patrimonio + 1) / 9, 0, 1.2)
    # Factor 9: Edades extremas
    + 0.35 * ((edad < 22) | (edad > 72)).astype(float)
    # Factor 10: Capacidad de pago disponible (a mas capacidad, menos riesgo)
    - 0.9 * np.clip(capacidad_pago, 0, 1)
    # ---- INTERACCIONES (efectos multiplicativos del mundo real) ----
    # Endeudado + mal historial = combinacion explosiva
    + 1.2 * ((relacion_deuda_ingreso > 0.5) & (historial_pagos < 0.5)).astype(float)
    # Joven + sin antiguedad + deudas
    + 0.6 * ((edad < 28) & (tiempo_empleo < 1.5) & (relacion_deuda_ingreso > 0.3)).astype(float)
    # Estado civil casado reduce ligeramente el riesgo
    - 0.15 * estado_civil
    # Ruido idiosincratico (eventos no modelables: enfermedad, divorcio, desempleo)
    + rng.normal(0, 0.3, N_MUESTRAS)
)

probabilidad_default = 1 / (1 + np.exp(-logit_pd))
# Etiqueta estocastica: Bernoulli(PD)
etiquetas = (rng.uniform(0, 1, N_MUESTRAS) < probabilidad_default).astype(float)

X = np.column_stack([
    edad, ingresos, estado_civil,
    deudas_existentes, relacion_deuda_ingreso, saldo_cuentas,
    historial_pagos, tiempo_empleo, tipo_empleo,
    patrimonio,
])

print(f"  Total de muestras generadas: {N_MUESTRAS}")
print(f"  Distribucion de clases: {int(etiquetas.sum())} riesgo / {int(N_MUESTRAS - etiquetas.sum())} sin riesgo")
print(f"  Distribucion por segmento:")
for tipo, nombre in [(0, "informal"), (1, "empleado"), (2, "independiente"), (3, "pensionado")]:
    mascara = tipo_empleo == tipo
    n = int(mascara.sum())
    if n > 0:
        morosidad = float(etiquetas[mascara].mean()) * 100
        pd_promedio = float(probabilidad_default[mascara].mean()) * 100
        ing_promedio = float(ingresos[mascara].mean())
        print(f"    {nombre:>14}: {n:>4} muestras | morosidad observada {morosidad:5.1f}% | PD promedio {pd_promedio:5.1f}% | ingreso promedio ${int(ing_promedio):>10,}".replace(",", "."))

# --- Normalizacion y division Train/Validacion ---

media = X.mean(axis=0)
desviacion = X.std(axis=0)
X_norm = (X - media) / (desviacion + 1e-8)

indices = rng.permutation(N_MUESTRAS)
n_train = int(0.8 * N_MUESTRAS)

X_train = X_norm[indices[:n_train]]
y_train = etiquetas[indices[:n_train]]
X_val = X_norm[indices[n_train:]]
y_val = etiquetas[indices[n_train:]]

X_train_t = torch.tensor(X_train, dtype=torch.float32)
y_train_t = torch.tensor(y_train, dtype=torch.float32).unsqueeze(1)
X_val_t = torch.tensor(X_val, dtype=torch.float32)
y_val_t = torch.tensor(y_val, dtype=torch.float32).unsqueeze(1)

print(f"\n  Datos de entrenamiento: {X_train_t.shape[0]} muestras")
print(f"  Datos de validacion:    {X_val_t.shape[0]} muestras")

# --- Definicion del modelo ---

N_FEATURES = 10


class RedNeuronalRiesgo(nn.Module):
    def __init__(self, n_features: int = N_FEATURES):
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


modelo = RedNeuronalRiesgo(n_features=N_FEATURES)

# --- Entrenamiento ---

# Pesos por clase para corregir desbalance: morosidad real es minoritaria.
# Usamos sqrt(neg/pos) en lugar del ratio puro: menos agresivo, conserva
# calibracion de la probabilidad y evita destruir la precision.
pos_rate = float(y_train_t.mean())
pos_weight_value = float(np.sqrt((1 - pos_rate) / max(pos_rate, 1e-3)))
sample_weights = torch.where(
    y_train_t == 1.0,
    torch.tensor(pos_weight_value, dtype=torch.float32),
    torch.tensor(1.0, dtype=torch.float32),
)
print(f"  Class balance: {pos_rate*100:.1f}% positivos | pos_weight = {pos_weight_value:.2f}")

criterio_train = nn.BCELoss(weight=sample_weights, reduction="mean")
criterio_val = nn.BCELoss()  # validacion sin pesos para metrica comparable
optimizador = optim.Adam(modelo.parameters(), lr=0.001, weight_decay=1e-4)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizador, mode="min", factor=0.5, patience=10)

epochs = 250
paciencia = 25
mejor_val_loss = float("inf")
contador_paciencia = 0
mejor_epoca = 0
mejores_pesos = None

historial_train_loss: list[float] = []
historial_val_loss: list[float] = []

print("\n  Entrenando...")

for epoch in range(epochs):
    modelo.train()
    pred_train = modelo(X_train_t)
    loss_train = criterio_train(pred_train, y_train_t)

    optimizador.zero_grad()
    loss_train.backward()
    optimizador.step()

    modelo.eval()
    with torch.no_grad():
        pred_val = modelo(X_val_t)
        loss_val = criterio_val(pred_val, y_val_t)

    scheduler.step(loss_val.item())

    historial_train_loss.append(float(loss_train.item()))
    historial_val_loss.append(float(loss_val.item()))

    if (epoch + 1) % 25 == 0 or epoch == 0:
        print(
            f"    Epoca {epoch+1:>4}/{epochs} | Train Loss: {loss_train.item():.4f} | Val Loss: {loss_val.item():.4f}"
        )

    if loss_val.item() < mejor_val_loss:
        mejor_val_loss = loss_val.item()
        mejor_epoca = epoch + 1
        contador_paciencia = 0
        mejores_pesos = {k: v.clone() for k, v in modelo.state_dict().items()}
    else:
        contador_paciencia += 1

    if contador_paciencia >= paciencia:
        print(f"\n    Early Stopping en epoca {epoch+1}")
        break

modelo.load_state_dict(mejores_pesos)
print(f"    Mejor epoca: {mejor_epoca} con Val Loss: {mejor_val_loss:.4f}")

# --- Evaluacion final ---

modelo.eval()
with torch.no_grad():
    pred_val_prob = modelo(X_val_t).numpy().flatten()
    pred_val_clases = (pred_val_prob >= 0.5).astype(int)

y_real = y_val_t.numpy().flatten().astype(int)

VP = int(np.sum((pred_val_clases == 1) & (y_real == 1)))
FP = int(np.sum((pred_val_clases == 1) & (y_real == 0)))
VN = int(np.sum((pred_val_clases == 0) & (y_real == 0)))
FN = int(np.sum((pred_val_clases == 0) & (y_real == 1)))

accuracy = (VP + VN) / max(VP + VN + FP + FN, 1)
auc_roc = float(roc_auc_score(y_real, pred_val_prob))
matriz = confusion_matrix(y_real, pred_val_clases).tolist()

precision = VP / max(VP + FP, 1)
recall = VP / max(VP + FN, 1)
f1 = (2 * precision * recall) / max(precision + recall, 1e-8)

print(f"\n  Accuracy:  {accuracy:.4f} ({accuracy*100:.1f}%)")
print(f"  AUC-ROC:   {auc_roc:.4f}")
print(f"  Precision: {precision:.4f}")
print(f"  Recall:    {recall:.4f}")
print(f"  F1-score:  {f1:.4f}")

# --- Persistencia ---

torch.save(mejores_pesos, "modelo/modelo_riesgo.pth")

stats = {
    "media": media.tolist(),
    "desviacion": desviacion.tolist(),
    "n_features": N_FEATURES,
    "nombres_features": [
        "edad",
        "ingresos",
        "estado_civil",
        "deudas_existentes",
        "relacion_deuda_ingreso",
        "saldo_cuentas",
        "historial_pagos",
        "tiempo_empleo",
        "tipo_empleo",
        "patrimonio",
    ],
}
with open("modelo/normalizacion.json", "w") as f:
    json.dump(stats, f, indent=2)

metricas = {
    "accuracy": float(accuracy),
    "auc_roc": auc_roc,
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
    "matriz_confusion": matriz,
    "mejor_epoca": mejor_epoca,
    "epocas_entrenadas": len(historial_train_loss),
    "muestras_entrenamiento": int(X_train_t.shape[0]),
    "muestras_validacion": int(X_val_t.shape[0]),
    "historial_loss": {
        "train": historial_train_loss,
        "val": historial_val_loss,
    },
}
with open("modelo/metricas.json", "w") as f:
    json.dump(metricas, f, indent=2)

background = X_train_t[:100]
torch.save(background, "modelo/background_shap.pt")

print("\n  Modelo guardado en modelo/modelo_riesgo.pth")
print("  Estadisticas en modelo/normalizacion.json")
print("  Metricas en modelo/metricas.json")
print("  Background SHAP en modelo/background_shap.pt")

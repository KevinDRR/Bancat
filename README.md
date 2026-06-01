# Bancat — Evaluador de Riesgo Crediticio

Simulador bancario académico que usa una red neuronal profunda (PyTorch) para evaluar
el riesgo crediticio de un cliente. Una sola predicción del modelo alimenta múltiples
decisiones de negocio: aprobación, monto máximo, tasa de interés, producto recomendado
y sugerencias de mejora. Incluye gestión de clientes (CRUD) y un dashboard analítico.

> 📘 La **documentación técnica detallada** (FastAPI, base de datos, modelos, CRUD,
> validaciones y excepciones) está en **[DocTecnico.pdf](DocTecnico.pdf)**.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Python 3, **FastAPI**, **Uvicorn** (ASGI) |
| Persistencia | **SQLite** vía **SQLAlchemy 2.0** (ORM) — archivo `bancat.db` |
| Modelo | **PyTorch** (red neuronal), scikit-learn (métricas), SHAP (explicabilidad) |
| Frontend | **SvelteKit** (SPA estática) + Tailwind CSS + Chart.js |
| Auth | `SessionMiddleware` de Starlette (cookie HMAC firmada con `itsdangerous`) |

---

## Características

- **Solicitud de crédito en 4 pasos** con simulador en vivo (recalcula riesgo al vuelo).
- **Formateo de moneda** con apóstrofes (`25'000'000`) en los campos de ingreso.
- **CRUD de clientes** (admin): buscar por id, editar, archivar y eliminar.
  La eliminación es en dos fases — primero **archiva** (soft-delete reversible) y un
  segundo intento **borra definitivamente y reindexa los ids**.
- **Dashboard analítico** con KPIs y gráficas de la cartera, que se actualiza al
  agregar/editar/eliminar clientes, más las métricas de desempeño del modelo.
- **Explicabilidad SHAP**: cada decisión muestra qué features la empujaron.

---

## Cómo correr el proyecto

### 1. Backend (FastAPI + Uvicorn)

```bash
# Crear y activar entorno virtual
python3 -m venv .venv
source .venv/bin/activate           # bash / zsh
# source .venv/bin/activate.fish    # fish

# Instalar dependencias
pip install -r requirements.txt

# (opcional) Reentrenar el modelo — genera .pth, .json y background_shap.pt
python modelo/entrenar.py

# (opcional) Poblar la BD con 50 clientes de ejemplo
python seed.py

# Levantar el servidor
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend (SvelteKit)

El backend sirve el **build estático** del frontend desde `frontend/build/`. Para
generarlo (o desarrollar con hot-reload):

```bash
cd frontend
npm install
npm run build          # genera frontend/build (lo sirve uvicorn en :8000)
# — o —
npm run dev            # dev server con HMR en http://localhost:5173 (proxy /api → :8000)
```

### URLs

| Ruta | Descripción |
|---|---|
| http://127.0.0.1:8000/ | Landing pública |
| http://127.0.0.1:8000/credito | Solicitud de crédito (4 pasos) |
| http://127.0.0.1:8000/clientes | Gestión de clientes — CRUD (admin) |
| http://127.0.0.1:8000/metricas | Dashboard: cartera + modelo (admin) |
| http://127.0.0.1:8000/docs | Swagger UI (OpenAPI) |

**Credenciales admin por defecto:** `admin` / `admin123`

---

## Estructura del repositorio

```
main.py                 # App FastAPI: endpoints, validación Pydantic, lógica de negocio
db.py                   # Capa de persistencia: modelos ORM, sesión, reindexado
seed.py                 # Poblador de la BD con clientes mock coherentes
bancat.db               # Base de datos SQLite (generada; ignorada por git)
requirements.txt        # Dependencias Python
DOCUMENTACION_TECNICA.md # Documentación técnica detallada
modelo/
  entrenar.py           # Datos sintéticos, arquitectura, entrenamiento
  modelo_riesgo.pth     # Pesos del modelo entrenado
  metricas.json         # AUC-ROC, accuracy, loss history, matriz de confusión
  normalizacion.json    # Media y std de las 10 features
  background_shap.pt    # Muestras para el DeepExplainer SHAP
frontend/               # SvelteKit (SPA)
  src/routes/           # Páginas: /, /credito, /clientes, /metricas, /login
  src/lib/components/    # Componentes UI (Input, MoneyInput, DonutChart, BarChart, …)
  src/lib/api.ts        # Cliente HTTP de la API
  build/                # Build estático servido por FastAPI (generado)
```

---

## Notas

- **Persistencia real:** los clientes viven en `bancat.db` (SQLite) y sobreviven
  reinicios. Para un despliegue con contenedores efímeros, montar un volumen o migrar
  a PostgreSQL (cambia solo `DATABASE_URL` en `db.py`).
- El modelo usa **datos sintéticos** calibrados sobre el mercado colombiano (sin
  género, raza ni ubicación — solo features financieras objetivas).
- Demo académica: la autenticación es simple (usuario/clave embebidos), no apta para
  producción real.

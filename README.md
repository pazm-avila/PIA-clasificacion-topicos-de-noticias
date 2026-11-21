# Clasificador de tópicos de noticias

**Proyecto Integrador Programación – Programa de Inteligencia Artificial (PIA)**
Universidad Nacional de Hurlingham.

Aplicación web que clasifica titulares de noticias en español en seis categorías: Deportes, Política, Tecnología, Economía, Cultura y Salud, y explica cada predicción. Utiliza un modelo de aprendizaje automático basado en TF-IDF y regresión logística, con tokenización por subpalabras (WordPiece). El modelo se expone mediante una API REST desarrollada con FastAPI y se consume desde una interfaz web desarrollada con React.

## Cómo funciona

1. El usuario ingresa un titular.
2. El frontend lo envía al endpoint `POST /api/classify`.
3. El backend normaliza el texto (sin tildes y en minúsculas), lo divide en subpalabras, lo convierte en vectores TF-IDF y calcula la probabilidad de cada categoría.
4. La API devuelve la categoría, la confianza, las probabilidades de las seis categorías y el aporte de cada token a la decisión.
5. Si ninguna categoría supera el 50 % de probabilidad, la respuesta es `Otros` (ver [Categoría Otros](#categoría-otros)).

## Alcances

- Clasificar titulares de noticias en seis categorías temáticas fijas.
- Mostrar la categoría predicha, su nivel de confianza y las probabilidades de las seis categorías entrenadas.
- Mostrar la contribución de cada token a la clasificación final.
- Derivar a `Otros` los titulares que no alcanzan el umbral de confianza.
- Ejecutarse de forma local, sin servicios externos.

## Limitaciones

- Solo se contemplan seis categorías fijas: `Otros` no es una categoría entrenada.
- No se aplica stemming ni lematización.
- La recolección de nuevos datos mediante feeds RSS requiere conexión a internet.

## Tecnologías

- Python 3.14
- FastAPI
- Uvicorn
- scikit-learn 1.9.1
- NumPy
- Pandas
- Joblib
- Tokenizers (Hugging Face)
- Feedparser (para recolección del dataset)
- React 19.3
- Vite
- Node.js 24.18
- Tailwind CSS
- Git

## Estructura del proyecto

```text
PIA/
├── backend/
│   ├── controllers/
│   │   └── classify_controller.py
│   ├── routes/
│   │   └── classify_route.py
│   ├── main.py
│   └── schemas.py
├── data/
│   └── dataset.csv
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validaciones/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── modelo/                  # scripts de datos y entrenamiento
│   ├── rss.py               # recolecta titulares desde feeds RSS y arma el dataset
│   ├── tokenizador.py       # tokenizador por subpalabras (WordPiece)
│   └── train.py             # entrena y evalúa el modelo
├── modelo.joblib            # modelo entrenado (lo genera train.py; scikit-learn 1.9.1)
├── requirements.txt
├── README.md
└── .gitignore
```

## Instalación

Se requiere tener instalados Python y Node.js.

### Backend

Desde la carpeta raíz del proyecto, crear y activar el entorno virtual:

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Instalar las dependencias:

```bash
python -m pip install -r requirements.txt
```
Es importante instalar la versión indicada en `requirements.txt`, en especial `scikit-learn==1.9.1`, ya que es la versión que se utilizó para entrenar el modelo; así evitar la advertencia `InconsistentVersionWarning` al cargar `modelo.joblib`.

### Frontend

Desde la carpeta raíz:

```bash
cd frontend
npm install
```

## Ejecución

### Entrenamiento del modelo

Desde la carpeta raíz, con el entorno virtual activado:

```bash
python -m modelo.train
```

Este proceso entrena y evalúa el modelo y genera `modelo.joblib`. El repositorio ya incluye el archivo, por lo que no hace falta entrenar para usar la aplicación; se debe volver a ejecutar solo si cambia el dataset o la configuración. Si `modelo.joblib` no existe, la API no arranca y muestra el mensaje de error: "`Falta modelo.joblib. Ejecutá python -m modelo.train`".

### Iniciar el backend

Desde la carpeta raíz:

```bash
uvicorn backend.main:app --reload
```

- API: `http://localhost:8000`
- Documentación interactiva: `http://localhost:8000/docs`

### Iniciar el frontend

Desde la carpeta `frontend`:

```bash
npm run dev
```

- Aplicación: `http://localhost:5173`

## API

### Clasificar un titular

**Endpoint:** `POST /api/classify`

Solicitud:

```json
{
  "titular": "Boca ganó el partido 2 a 0"
}
```

Respuesta (resumida):

```json
{
  "categoria": "Deportes",
  "confianza": 0.72,
  "probabilidades": { "Cultura": 0.07, "Deportes": 0.72, "...": 0.0 },
  "explicabilidad": {
    "tokens": [{ "token": "boca", "aportes": { "Deportes": 0.9, "...": 0.0 } }],
    "puntaje_inicial": { "Deportes": 0.05, "...": 0.0 },
    "puntajes": { "Deportes": 1.4, "...": 0.0 }
  }
}
```

- `categoria`: la categoría predicha, u `Otros` si la confianza máxima es inferior al umbral.
- `confianza`: probabilidad de la categoría más probable.
- `probabilidades`: probabilidad de las seis categorías entrenadas.
- `explicabilidad`: aporte de cada token a cada categoría (positivo a favor, negativo en contra), junto con el puntaje inicial y los puntajes finales.

El titular debe tener entre 3 y 200 caracteres y al menos una letra; en caso contrario, la API responde 422.

## Categoría Otros

`Otros` no es una categoría entrenada, sino una flag que indica que ninguna de las seis categorías alcanzó el umbral de confianza establecido (**0,50**). Cuando la probabilidad máxima no supera este umbral, la API devuelve `"categoria": "Otros"`. No tiene probabilidad propia ni aparece en `probabilidades`.

## Dataset

El dataset (`data/dataset.csv`) contiene 6.036 titulares de noticias en español (1.006 por categoría), recolectados mediante feeds RSS de distintos medios y portales de noticias argentinos, además de feeds temáticos de Google Noticias configurados para Argentina. La categoría se asigna según el feed del que se obtiene cada titular. Se eliminan duplicados y se balancean las seis categorías. La ejecución de `rss.py` requiere conexión a internet y puede modificar el dataset, por lo que las métricas de evaluación pueden variar.

## Resultados de evaluación

Resultados de la última ejecución de `modelo/train.py`.

**Conjunto de prueba** (20 %, división estratificada):

| Métrica | Resultado |
|---|---:|
| Exactitud | 81,13 % |
| Precisión macro | 0,81 |
| Recall macro | 0,81 |
| F1 macro | 0,81 |

**Por categoría:**

| Categoría | Precisión | Recall | F1 |
|---|---:|---:|---:|
| Cultura | 0,75 | 0,85 | 0,80 |
| Deportes | 0,90 | 0,83 | 0,87 |
| Economía | 0,74 | 0,70 | 0,72 |
| Política | 0,84 | 0,84 | 0,84 |
| Salud | 0,92 | 0,88 | 0,90 |
| Tecnología | 0,73 | 0,77 | 0,75 |

**Validación cruzada** (5 cortes estratificados): F1 macro promedio de 0,8241.

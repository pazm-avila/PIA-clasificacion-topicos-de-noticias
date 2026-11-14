# Clasificador de tópicos de noticias

**Proyecto Integrador Programación – Programa de Inteligencia Artificial (PIA)**
Universidad Nacional de Hurlingham.

Aplicación web que clasifica titulares de noticias en español en seis categorías: Deportes, Política, Tecnología, Economía, Cultura y Salud, y explica cada predicción. Utiliza un modelo de aprendizaje automático basado en TF-IDF y regresión logística, con tokenización por subpalabras (WordPiece). El modelo se expone mediante una API REST desarrollada con FastAPI y se consume desde una interfaz web desarrollada con React.

## Cómo funciona

1. El usuario ingresa un titular.
2. El frontend lo envía al endpoint `POST /api/classify`.
3. El backend normaliza el texto (sin tildes y en minúsculas), lo divide en subpalabras, lo convierte en vectores TF-IDF y calcula la probabilidad de cada categoría.
4. La API devuelve la categoría, la confianza, las probabilidades de las seis categorías y el aporte de cada token a la decisión.
5. Si ninguna categoría supera el 30 % de probabilidad, la respuesta es `Otros` (ver [Categoría Otros](#categoría-otros)).

## Alcances

- Clasificar titulares de noticias en seis categorías temáticas fijas.
- Mostrar la categoría predicha, su nivel de confianza y las probabilidades de las seis categorías entrenadas.
- Mostrar la contribución de cada token a la clasificación final.
- Derivar a `Otros` los titulares que no alcanzan el umbral de confianza.
- Ejecutarse de forma local, sin servicios externos.

## Limitaciones

- Solo se contemplan seis categorías fijas: `Otros` no es una categoría entrenada.
- La validación de entrada es mínima (de 3 a 200 caracteres y al menos una letra): un texto sin sentido que contenga letras puede recibir una categoría.
- El corpus es de tamaño moderado y con un sesgo parcial de fuentes (algunas categorías dependen de pocos medios).
- No se aplica stemming ni lematización, y la tokenización por subpalabras no captura sinónimos.
- No hay base de datos: cada consulta es independiente.
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
venv\Scripts\activate
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

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

`Otros` no es una categoría entrenada ni tiene probabilidad propia: es una respuesta residual y no aparece en `probabilidades`. Cuando la probabilidad máxima entre las seis categorías es menor a **0,30**, la API devuelve `"categoria": "Otros"`.

## Dataset

El dataset (`data/dataset.csv`) contiene 1.638 titulares de noticias en español (273 por categoría), recolectados con `modelo/rss.py` y `feedparser` desde feeds RSS de diarios argentinos y feeds por tema de Google Noticias. La sección del feed define la etiqueta. Se eliminan duplicados y se balancean las categorías. Ejecutar `rss.py` (requiere internet) suma las noticias del día y modifica el dataset, por lo que las métricas pueden variar.

## Resultados de evaluación

Resultados de la última ejecución de `modelo/train.py`.

**Conjunto de prueba** (20 %, división estratificada):

| Métrica | Resultado |
|---|---:|
| Exactitud | 82,58 % |
| Precisión macro | 0,83 |
| Recall macro | 0,83 |
| F1 macro | 0,83 |

**Validación cruzada** (5 cortes estratificados): F1 macro promedio de 0,8281.

# Clasificador de tópicos de noticias

Aplicación web que clasifica titulares de noticias en español en seis categorías (Deportes, Política, Tecnología, Economía, Cultura y Salud). Un modelo de aprendizaje automático (TF-IDF + regresión logística) se expone mediante una API REST con FastAPI y se consume desde un frontend en React.

Proyecto Integrador Programación – Programa de Inteligencia Artificial (PIA), Universidad Nacional de Hurlingham.

## Cómo funciona

1. El usuario ingresa un titular.
2. El frontend lo envía a `POST /api/classify`.
3. El backend convierte el texto a vectores TF-IDF y calcula la probabilidad de cada categoría.
4. Responde con la categoría predicha, su confianza y las probabilidades de las seis categorías.

## Alcances

* Clasificar titulares de noticias en seis categorías temáticas fijas.
* Mostrar la categoría predicha junto con su nivel de confianza y las probabilidades de todas las categorías.

## Limitaciones

* Solo se contemplan seis categorías fijas, sin una clase “otro” para textos que no son noticias.
* No se aplica normalización lingüística avanzada (stemming o lematización).

## Tecnologías

* Python 3.14
* FastAPI
* Uvicorn
* React 19.3
* Vite
* Node 24.18
* scikit-learn
* NumPy
* joblib
* Git

## Estructura

```text
PIA/
├── data/
│   └── dataset.csv
├── frontend/
├── requirements.txt
├── .gitignore
└── README.md
```
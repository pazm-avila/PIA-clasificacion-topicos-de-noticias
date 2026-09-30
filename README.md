# Proyecto Integrador Programación

## Programa de Inteligencia Artificial (PIA): Clasificación de tópicos de noticias (multiclase)

### 1. Tema

El proyecto consiste en desarrollar un sistema de clasificación automática de tópicos de noticias: dado el titular de una noticia en español, el sistema determina a qué categoría pertenece (Deportes, Política, Tecnología, Economía, Cultura o Salud). Se trata de un problema de clasificación de texto supervisada multiclase, resuelto con un modelo clásico de aprendizaje automático (TF-IDF + regresión logística) y expuesto como una aplicación web interactiva.

### 2. Contexto organizacional

Este proyecto se enmarca en el Proyecto Integrador Programación del Programa de Inteligencia Artificial (PIA) de la Universidad Nacional de Hurlingham. La actividad busca que el estudiante aplique, de forma integrada, los conocimientos de programación y de aprendizaje automático adquiridos en la carrera, desarrollando un producto funcional completo: desde la construcción de los datos y el entrenamiento del modelo hasta su despliegue como aplicación web. La clasificación de noticias es una aplicación real y comprensible del procesamiento de lenguaje natural, con impacto directo en áreas como la organización de contenidos, los portales de noticias y los sistemas de recomendación.

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
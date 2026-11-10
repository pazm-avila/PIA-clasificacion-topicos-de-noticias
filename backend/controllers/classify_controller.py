from pathlib import Path
import joblib
import numpy as np
from backend.schemas import Entrada

RAIZ = Path(__file__).resolve().parent.parent.parent
modelo = joblib.load(RAIZ / "modelo.joblib")

subpalabras = modelo.named_steps["subpalabras"]
tfidf = modelo.named_steps["tfidf"]
clf = modelo.named_steps["clf"]

nombres = tfidf.get_feature_names_out()
clases = list(clf.classes_)


def explicar(texto: str, n: int = 8) -> dict:
    X = tfidf.transform(subpalabras.transform([texto])).tocsr()

    indices = X.indices
    valores = X.data

    # aporte de cada token a cada categoría
    aportes = valores[:, None] * clf.coef_[:, indices].T

    # puntaje final = aportes + valor inicial
    puntajes = aportes.sum(axis=0) + clf.intercept_

    # tokens más influyentes
    orden = (np.argsort(np.max(np.abs(aportes), axis=1))[::-1][:n] if len(indices) else [])

    return {
        "tokens": [
            {
                "token": str(nombres[indices[i]]),
                "aportes": {
                    c: float(aportes[i, k])
                    for k, c in enumerate(clases)
                },
            }
            for i in orden
        ],
        "puntaje_inicial": {
            c: float(clf.intercept_[k])
            for k, c in enumerate(clases)
        },
        "puntajes": {
            c: float(puntajes[k])
            for k, c in enumerate(clases)
        },
    }


def clasificar(entrada: Entrada) -> dict:
    probs = modelo.predict_proba([entrada.titular])[0]

    probabilidades = {c: float(p) for c, p in zip(clases, probs)}

    mejor = max(probabilidades, key=probabilidades.get)
    confianza = probabilidades[mejor]
    categoria = mejor if confianza >= 0.3 else "Otros"

    return {
        "categoria": categoria,
        "confianza": confianza,
        "probabilidades": probabilidades,
        "explicabilidad": explicar(entrada.titular),
    }
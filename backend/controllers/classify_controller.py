from pathlib import Path
import joblib
from backend.schemas import Entrada

RAIZ = Path(__file__).resolve().parent.parent.parent
modelo = joblib.load(RAIZ / "modelo.joblib")


def clasificar(entrada: Entrada) -> dict:
    probs = modelo.predict_proba([entrada.titular])[0]
    probabilidades = {c: float(p) for c, p in zip(modelo.classes_, probs)}
    categoria = max(probabilidades, key=probabilidades.get)

    return {
        "categoria": categoria,
        "confianza": probabilidades[categoria],
        "probabilidades": probabilidades,
    }
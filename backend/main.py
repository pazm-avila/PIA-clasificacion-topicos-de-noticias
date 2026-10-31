from pathlib import Path
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

RAIZ = Path(__file__).resolve().parent.parent
modelo = joblib.load(RAIZ / "modelo.joblib")

app = FastAPI(title="Clasificador de tópicos de noticias")


class Entrada(BaseModel):
    titular: str


@app.post("/api/classify")
def predict(entrada: Entrada): # esto es req,res => {}
    texto = entrada.titular.strip()
    if not texto:
        raise HTTPException(status_code=422, detail="El titular no puede estar vacío")

    probs = modelo.predict_proba([texto])[0]
    probabilidades = {c: float(p) for c, p in zip(modelo.classes_, probs)}
    categoria = max(probabilidades, key=probabilidades.get)

    return {
        "categoria": categoria,
        "confianza": probabilidades[categoria],
        "probabilidades": probabilidades,
    }
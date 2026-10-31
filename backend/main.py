from fastapi import FastAPI
from backend.routes import classify_route

app = FastAPI(title="Clasificador de tópicos de noticias")

@app.get("/")
def inicio():
    return {"mensaje": "API funcionando"}

app.include_router(classify_route.router)
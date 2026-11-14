from fastapi import FastAPI
from backend.routes import classify_route

app = FastAPI(title="Clasificador de tópicos de noticias")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def inicio():
    return {"mensaje": "API funcionando"}

app.include_router(classify_route.router)
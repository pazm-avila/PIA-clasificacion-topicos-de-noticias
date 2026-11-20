from fastapi import APIRouter
from backend.controllers import classify_controller
from backend.schemas import RespuestaClasificar

router = APIRouter(prefix="/api")

router.post("/classify", response_model=RespuestaClasificar)(classify_controller.clasificar)
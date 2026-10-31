from fastapi import APIRouter
from backend.controllers import classify_controller

router = APIRouter(prefix="/api")

router.post("/classify")(classify_controller.clasificar)
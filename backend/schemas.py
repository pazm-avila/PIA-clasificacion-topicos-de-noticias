import re
from pydantic import BaseModel, ConfigDict, Field, field_validator

MIN_TITULAR = 3
MAX_TITULAR = 200
LETRAS = re.compile(r"[^\W\d_]")


class Entrada(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    titular: str = Field(min_length=MIN_TITULAR, max_length=MAX_TITULAR)

    @field_validator("titular")
    @classmethod
    def tiene_letras(cls, v: str) -> str:
        if not LETRAS.search(v):
            raise ValueError("El titular debe incluir texto, no solo números o símbolos.")
        return v

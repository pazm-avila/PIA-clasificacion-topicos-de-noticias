from pydantic import BaseModel, ConfigDict, Field

class Entrada(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    titular: str = Field(min_length=2, max_length=500)
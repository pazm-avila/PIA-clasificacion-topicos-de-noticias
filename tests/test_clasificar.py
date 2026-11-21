import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas import RespuestaClasificar

client = TestClient(app)

def clasificar(titular):
    return client.post("/api/classify", json={"titular":titular})


CATEGORIAS = {"Cultura", "Deportes", "Economia", "Politica", "Salud", "Tecnologia"}
UMBRAL_OTROS = 0.5

@pytest.mark.parametrize("titular, categoria", [
    ("Boca gana 2 a 0 y clasifica a la final", "Deportes"),
    ("El senado aprobó una nueva ley durante la sesión", "Politica"),
    ("La inflación mensual registró una nueva suba", "Economia"),
    ("Estreno solo en cines: Los juegos del hambre", "Cultura"),
    ("La empresa presentó un nuevo celular con inteligencia artificial", "Tecnologia"),
    ("Un hospital incorporó un nuevo tratamiento médico", "Salud")
])
def test_clasificar_categorias(titular, categoria):
    prediccion = clasificar(titular)
    assert prediccion.status_code == 200
    p = prediccion.json()
    assert p["categoria"] == categoria, (
        f"Se esperaba {categoria}, pero se obtuvo "
        f"{p['categoria']} con confianza "
        f"{p['confianza']:.2f}"
    )
    

@pytest.mark.parametrize("titular", [
    "Lluvias y Tormentas: qué esperar durante la semana",
    "Milei anuncia el fenómeno del Niño",
    "Ráfagas de más de 90 km/h en el noreste",
    "asdfgh qwerty zxcvbn"
])
def test_categoria_otros(titular):
    prediccion = clasificar(titular)
    p = prediccion.json()
    assert p["categoria"] == "Otros", (
        f"El titular debería ser Otros, pero se clasificó como "
        f"{p['categoria']} con confianza "
        f"{p['confianza']:.2f}"
    )
    
@pytest.mark.xfail(
    reason="Limitación: un policial recibe categoría Tecnologia con confianza alta",
    strict=False
)
def test_titular_otros_recibe_confianza_alta():
    prediccion = clasificar("Avanza la investigación judicial tras el hallazgo de una joven sin vida en Córdoba")
    assert prediccion.json()["categoria"] == "Otros"
    
    
@pytest.mark.parametrize("titular", [
    "ab",
    "123456",
    "",
    "  ",
    "a" * 201,
    "?? ????",
    "??#$?#"
])
def test_validaciones(titular):
    prediccion = clasificar(titular)
    assert prediccion.status_code == 422
    


def test_normalizacion_de_texto():
    titulares = [
        "La inflación preocupa",
        "La inflacion preocupa",
        "LA INFLACION PREOCUPA",
        "LA INFLACIÓN PREOCUPA",
    ]
    categorias = set()
    for t in titulares:
        prediccion = clasificar(t)
        categorias.add(prediccion.json()["categoria"])
        
    assert len(categorias) == 1
    
    
def test_respuesta_cumple_el_esquema():
    rta = clasificar("El senado aprobó una nueva ley durante la sesión")
    assert rta.status_code == 200
    data = RespuestaClasificar.model_validate(rta.json())
    assert set(data.probabilidades) == CATEGORIAS
    assert data.confianza == pytest.approx(max(data.probabilidades.values()))


def test_explicabilidad_incluye_las_seis_categorias():
    exp = clasificar("La inflación mensual registró una nueva suba").json()["explicabilidad"]
    assert exp["tokens"]
    assert set(exp["puntajes"]) == CATEGORIAS
    for token in exp["tokens"]:
        assert set(token["aportes"]) == CATEGORIAS


def test_tipo_incorrecto():
    assert client.post("/api/classify", json={"titular": 123}).status_code == 422
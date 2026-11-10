from pathlib import Path
import feedparser
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
DATASET = RAIZ / "data" / "dataset.csv"

FEED_MAX = 100

RSS = {
    "Deportes": [
        "https://www.diariocronica.com.ar/rss/deportes/",
        "http://cadena3.com/rss/Deportes.xml",
        "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/deportes/notas",
        "https://eleconomista.com.ar/deportes/feed/",
        "https://www.ambito.com/rss/pages/deportes.xml",
        "https://www.cipo360.com.ar/rss/deportes/",
        "https://www.noticiasnet.com.ar/rss/deportes/",
        "https://www.clarin.com/rss/deportes/",
        "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/deportes/?outputType=xml",
        "https://www.infobae.com/arc/outboundfeeds/rss/category/deportes/?outputType=xml",
        "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=es-419&gl=AR&ceid=AR:es-419",
    ],
    "Politica": [
        "https://www.diariocronica.com.ar/rss/politica/",
        "https://www.clarin.com/rss/politica/",
        "https://eleconomista.com.ar/politica/feed/",
        "https://www.ambito.com/rss/pages/politica.xml",
        "https://www.cipo360.com.ar/rss/politica/",
        "https://www.apfdigital.com.ar/rss/politicas/",
        "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/politica/?outputType=xml",
        "https://www.infobae.com/arc/outboundfeeds/rss/category/politica/?outputType=xml",
    ],
    "Economia": [
        "https://www.diariocronica.com.ar/rss/economia/",
        "https://www.clarin.com/rss/economia/",
        "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/economia/notas",
        "https://eleconomista.com.ar/economia/feed/",
        "https://www.ambito.com/rss/pages/economia.xml",
        "https://www.cipo360.com.ar/rss/economia/",
        "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/economia/?outputType=xml",
        "https://www.infobae.com/arc/outboundfeeds/rss/category/economia/?outputType=xml",
        "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=es-419&gl=AR&ceid=AR:es-419",
    ],
    "Cultura": [
        "https://www.diariocronica.com.ar/rss/cultura",
        "https://www.clarin.com/rss/cultura/",
        "https://www.cipo360.com.ar/rss/cultura/",
        "https://www.elcordillerano.com.ar/rss/cultura/",
        "https://www.pagina12.com.ar/arc/outboundfeeds/rss/suplementos/cultura-y-espectaculos/notas",
        "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/cultura/?outputType=xml",
        "https://www.infobae.com/arc/outboundfeeds/rss/category/cultura/?outputType=xml",
        "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=es-419&gl=AR&ceid=AR:es-419",
    ],
    "Tecnologia": [
        "https://www.diariocronica.com.ar/rss/tecno-ocio-ciencia/",
        "https://www.clarin.com/rss/tecnologia/",
        "https://eleconomista.com.ar/tech/feed/",
        "https://www.ambito.com/rss/pages/tecnologia.xml",
        "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/tecnologia/?outputType=xml",
        "https://www.infobae.com/arc/outboundfeeds/rss/category/tecno/?outputType=xml",
        "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=es-419&gl=AR&ceid=AR:es-419",
    ],
    "Salud": [
        "https://www.lamontana.com.ar/rss/salud",
        "https://www.stopenlinea.com.ar/rss/salud/",
        "https://www.clarin.com/rss/buena-vida/",
        "https://www.noticierodigital.com.ar/categoria/salud/feed/",
        "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/salud/?outputType=xml",
        "https://www.infobae.com/arc/outboundfeeds/rss/category/salud/?outputType=xml",
        "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=es-419&gl=AR&ceid=AR:es-419",
        "https://news.google.com/rss/search?q=salud&hl=es-419&gl=AR&ceid=AR:es-419",
    ],
}

filas = []
for categoria, urls in RSS.items():
    for url in urls:
        feed = feedparser.parse(url)
        print(f"{categoria:11} {len(feed.entries):3} titulares  <- {url}")
        for e in feed.entries[:FEED_MAX]:
            titulo = e.title.strip()
            if "news.google.com" in url:
                titulo = titulo.rsplit(" - ", 1)[0].strip()
            filas.append({"Titular": titulo, "Categoria": categoria})

if DATASET.exists():
    base = pd.read_csv(DATASET)
else:
    base = pd.DataFrame(columns=["Titular", "Categoria"])

df = pd.concat([base, pd.DataFrame(filas)], ignore_index=True)
df = df.drop_duplicates(subset="Titular")

print("\nRecolectados (base + nuevos, antes de balancear):")
print(df["Categoria"].value_counts())

#balanceo
minimo = df["Categoria"].value_counts().min()
df = df.groupby("Categoria").sample(n=minimo, random_state=42)

df.to_csv(DATASET, index=False)
print(f"\ndataset.csv generado: {minimo} titulares por categoría ({len(df)} en total)")
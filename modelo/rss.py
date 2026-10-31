from pathlib import Path
import feedparser
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
DATASET = RAIZ / "data" / "dataset.csv"

RSS = {
    "Deportes":   ["https://www.diariocronica.com.ar/rss/deportes/", "http://cadena3.com/rss/Deportes.xml"],
    "Politica":   ["https://www.diariocronica.com.ar/rss/politica/", "https://www.clarin.com/rss/politica/"],
    "Economia":   ["https://www.diariocronica.com.ar/rss/economia/", "https://www.clarin.com/rss/economia/"],
    "Cultura":    ["https://www.diariocronica.com.ar/rss/cultura", "https://www.clarin.com/rss/cultura/"],
    "Tecnologia": ["https://www.diariocronica.com.ar/rss/tecno-ocio-ciencia/", "https://www.clarin.com/rss/tecnologia/"],
    "Salud":      ["https://medlineplus.gov/spanish/groupfeeds/new.xml", "https://www.perfil.com/feed/salud", "https://www.lamontana.com.ar/rss/salud"],
}


filas = []
for categoria, urls in RSS.items():
    for url in urls:
        feed = feedparser.parse(url)
        print(f"{categoria:11} {len(feed.entries):3} titulares  <- {url}")
        for e in feed.entries:
            filas.append({"Titular": e.title.strip(), "Categoria": categoria})

df = pd.DataFrame(filas).drop_duplicates(subset="Titular")

print("\nRecolectados (antes de balancear):")
print(df["Categoria"].value_counts())

# balanceo
minimo = df["Categoria"].value_counts().min()
df = df.groupby("Categoria").sample(n=minimo, random_state=42)

df.to_csv(DATASET, index=False)
print(f"\ndataset.csv generado: {minimo} titulares por categoría")
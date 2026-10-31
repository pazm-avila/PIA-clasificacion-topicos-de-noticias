from pathlib import Path
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer


RAIZ = Path(__file__).resolve().parent.parent
df = pd.read_csv(RAIZ / "data" / "dataset.csv")

print(df.shape)
print(df["Categoria"].value_counts())

vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X = vectorizer.fit_transform(df["Titular"])

print(X.shape)  # (titulares, cantidad de palabras y pares distintos)
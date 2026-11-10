from pathlib import Path
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

RAIZ = Path(__file__).resolve().parent.parent
df = pd.read_csv(RAIZ / "data" / "dataset.csv")
print(df["Categoria"].value_counts())

X_train, X_test, y_train, y_test = train_test_split(
    df["Titular"], df["Categoria"],
    test_size=0.2, random_state=42, stratify=df["Categoria"]
)

modelo = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("clf", LogisticRegression(max_iter=1000, C=10)),
])
modelo.fit(X_train, y_train)

y_pred = modelo.predict(X_test)
print("Exactitud:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))

joblib.dump(modelo, RAIZ / "modelo.joblib")

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(modelo, df["Titular"], df["Categoria"], cv=cv, scoring="f1_macro")
print("F1 macro por corte:", scores)
print("Promedio:", scores.mean())
print("Modelo guardado en modelo.joblib")
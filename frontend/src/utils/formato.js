export const UMBRAL_OTROS = 0.3;

export const NOMBRES = {
  Politica: "Política", Economia: "Economía", Deportes: "Deportes",
  Salud: "Salud", Cultura: "Cultura", Tecnologia: "Tecnología", Otros: "Otros",
};

export const nombre = (cat) => NOMBRES[cat] ?? cat;
export const num = (n, dec = 2) => n.toFixed(dec).replace(".", ",");
export const porcentaje = (n, dec = 0) => `${num(n * 100, dec)}%`;
export const signado = (n) => `${n >= 0 ? "+" : "−"}${num(Math.abs(n))}`;

export const masProbable = (probabilidades) =>
  Object.entries(probabilidades).sort((a, b) => b[1] - a[1])[0][0];

const limpiar = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function palabrasClave(titular, tokens, cat, max = 3) {
  const palabras = titular
    .split(/\s+/)
    .map((p) => p.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
  const positivos = tokens
    .filter((t) => t.aportes[cat] > 0)
    .sort((a, b) => b.aportes[cat] - a.aportes[cat]);

  const resultado = [];
  for (const { token } of positivos) {
    for (const parte of token.split(" ")) {
      const fragmento = limpiar(parte.replace(/^##/, ""));
      if (fragmento.length < 2) continue;
      const hallada = palabras.find((p) => limpiar(p).includes(fragmento));
      if (hallada && !resultado.includes(hallada.toLowerCase())) {
        resultado.push(hallada.toLowerCase());
      }
    }
    if (resultado.length >= max) break;
  }
  return resultado.slice(0, max);
}
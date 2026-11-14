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

export function palabrasPorSigno(titular, tokens, cat, max = 4) {
  const limpiar = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const palabras = titular
    .split(/\s+/)
    .map((p) => p.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((p) => p.length >= 3);

  const suma = new Map();
  for (const { token, aportes } of tokens) {
    const partes = token
      .split(" ")
      .map((p) => limpiar(p.replace(/^##/, "")))
      .filter((p) => p.length >= 2);
    if (partes.length === 0) continue;
    const peso = aportes[cat] / partes.length;
    for (const parte of partes) {
      const palabra = palabras.find((p) => limpiar(p).includes(parte));
      if (palabra) {
        const clave = palabra.toLowerCase();
        suma.set(clave, (suma.get(clave) ?? 0) + peso);
      }
    }
  }

  const lista = [...suma.entries()];
  return {
    aFavor: lista.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, max).map(([p]) => p),
    enContra: lista.filter(([, v]) => v < 0).sort((a, b) => a[1] - b[1]).slice(0, max).map(([p]) => p),
  };
}
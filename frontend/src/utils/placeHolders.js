const PLACEHOLDERS = [
  "Boca ganó 2 a 0 con un gol sobre el final",
  "El dólar cerró la semana con una fuerte suba",
  "El Hospital Garrahan lanzó una campaña de vacunación",
  "Una película argentina se estrena en el Festival de Cannes",
  "Presentan un celular con inteligencia artificial integrada",
  "El Senado debate un nuevo proyecto de ley",
  "La inflación de octubre fue menor a la esperada",
  "Hallan una nueva variante del virus de la gripe",
  "El Banco Central modificó las tasas de interés",
  "Un museo de Buenos Aires inaugura una muestra de fotografía",
  "La selección clasificó al Mundial tras una victoria histórica",
  "Una startup argentina lanza una plataforma de ciberseguridad",
];

export function placeholderAleatorio(excluir) {
  const opciones = PLACEHOLDERS.filter((e) => e !== excluir);
  return opciones[Math.floor(Math.random() * opciones.length)];
}
export const MIN_TITULAR = 3;
export const MAX_TITULAR = 200;

export function validarTitular(texto) {
  const t = texto.trim();
  if (!t) return "El titular no puede estar vacío.";
  if (t.length < MIN_TITULAR) return `El titular debe tener al menos ${MIN_TITULAR} caracteres.`;
  if (t.length > MAX_TITULAR) return `El titular no puede superar los ${MAX_TITULAR} caracteres.`;
  if (!/\p{L}/u.test(t)) return "El titular debe incluir texto, no solo números o símbolos.";
  
  return "";
}
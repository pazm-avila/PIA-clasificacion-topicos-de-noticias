const API_URL = "http://localhost:8000/api/classify";

export async function clasificarTitular(titular) {
  let r;
  try {
    r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titular }),
    });
  } catch {
    throw new Error("No se pudo conectar con el backend. ¿Está corriendo uvicorn?");
  }
  if (r.status === 422) {
  const cuerpo = await r.json().catch(() => null);
  const mensaje = cuerpo?.detail?.[0]?.msg?.replace(/^Value error, /, "");
  throw new Error(mensaje ?? "El titular no es válido.");
}
  if (!r.ok) throw new Error("Error del servidor.");
  return r.json();
}
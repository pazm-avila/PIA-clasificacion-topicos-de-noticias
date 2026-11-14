import { useState } from "react";
import { validarTitular } from "../validaciones/titular";
import { placeholderAleatorio } from "../utils/placeHolders";
import Card from "./Card";
import IconCargando from "./icons/IconCargando";

export default function Form({ onEnviar, cargando, error, onError }) {
  const [titular, setTitular] = useState("");
  const [placeholder, setPlaceholder] = useState(placeholderAleatorio);

  function enviar(e) {
    e.preventDefault();
    const mensaje = validarTitular(titular);
    if (mensaje) {
      onError(mensaje);
      return;
    }
    onError("");
    onEnviar(titular.trim());
    setPlaceholder((actual) => placeholderAleatorio(actual));
  }

  function cambiar(e) {
    setTitular(e.target.value);
    if (error) onError("");
  }

  return (
    <form onSubmit={enviar} noValidate>
      <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <label htmlFor="titular" className="sr-only">Titular de la noticia</label>
        <input
          id="titular"
          type="text"
          value={titular}
          onChange={cambiar}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-soft"
        />
        <button
          disabled={cargando}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando && <IconCargando className="h-4 w-4 animate-spin" />}
          {cargando ? "Clasificando..." : "Clasificar"}
        </button>
      </Card>
      {error && (
        <p role="alert" className="mt-2 px-1 text-sm font-medium text-negative">
          {error}
        </p>
      )}
    </form>
  );
}
import Card from "./Card";
import Tag from "./Tag";
import { masProbable, nombre, porcentaje } from "../utils/formato";

export default function Resultado({ res }) {
  const esOtros = res.categoria === "Otros";
  const cercana = masProbable(res.probabilidades);

  return (
    <Card className="relative overflow-hidden p-6">
      <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border border-border" />
      <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-border" />

      <Tag>Categoría estimada</Tag>
      <span
        className={`mt-5 inline-block rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
          esOtros ? "bg-negative/15 text-negative" : "bg-primary/15 text-primary"
        }`}
      >
        {esOtros ? "Confianza insuficiente" : "Confianza suficiente"}
      </span>

      <h2 className="mt-4 text-4xl font-extrabold tracking-tight">{nombre(res.categoria)}</h2>

      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-xl font-bold tabular-nums">{porcentaje(res.confianza)}</span>
        <span className="text-sm text-soft">
          {esOtros ? `en ${nombre(cercana)}, la más cercana` : "de confianza"}
        </span>
      </p>
    </Card>
  );
}
import Card from "./Card";
import Tag from "./Tag";
import { UMBRAL_OTROS, nombre, porcentaje } from "../utils/formato";

export default function Probabilidades({ res, sel, onSeleccionar }) {
  const ordenadas = Object.entries(res.probabilidades).sort((a, b) => b[1] - a[1]);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <Tag>Distribución</Tag>
          <h2 className="mt-1 text-xl font-bold">Probabilidad por categoría</h2>
        </div>
        <span className="text-xs text-soft">0 – 100%</span>
      </div>

      <ul className="mt-5 space-y-1">
        {ordenadas.map(([cat, p]) => {
          const gana = cat === res.categoria;
          const glow = gana ? { boxShadow: "var(--glow)" } : undefined;
          return (
            <li key={cat}>
              <button
                type="button"
                onClick={() => onSeleccionar(cat)}
                aria-pressed={cat === sel}
                className={`relative block w-full rounded-xl border px-3 py-2.5 text-left transition duration-200 hover:bg-surface ${cat === sel
                    ? "z-10 scale-[1.03] border-primary/60 bg-surface shadow-lg shadow-black/25 ring-1 ring-primary/30 dark:border-primary dark:bg-primary/15 dark:shadow-primary/40 dark:ring-2 dark:ring-primary/50"
                    : "border-transparent"
                  }`}
              >
                <span className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${gana ? "bg-winner" : "bg-bar"}`}
                      style={glow}
                    />
                    {nombre(cat)}
                  </span>
                  <span className={`tabular-nums ${gana ? "text-winner" : ""}`}>
                    {porcentaje(p)}
                  </span>
                </span>
                <span className="relative mt-2.5 block h-2.5 rounded-full bg-foreground/10">
                  <span
                    className={`block h-full rounded-full ${gana ? "bg-winner" : "bg-bar"}`}
                    style={{ width: `${p * 100}%`, ...glow }}
                  />
                  <span
                    className="absolute -inset-y-0.5 w-px bg-foreground/50"
                    style={{ left: `${UMBRAL_OTROS * 100}%` }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-pretty text-xs leading-relaxed text-soft">
        La marca vertical indica el {UMBRAL_OTROS * 100} %: si ninguna categoría lo supera, el titular se clasifica como <strong className="text-foreground">Otros</strong>.
        Tocá una categoría para ver su explicación.
      </p>
    </Card>
  );
}
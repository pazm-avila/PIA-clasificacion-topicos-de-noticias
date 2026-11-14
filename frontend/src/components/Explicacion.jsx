import Card from "./Card";
import Tag from "./Tag";
import IconInfo from "./icons/IconInfo";
import { nombre, num, signado } from "../utils/formato";

const COLS =
  "grid grid-cols-[6rem_minmax(0,1fr)_3.5rem] items-center gap-4 sm:grid-cols-[8rem_minmax(0,1fr)_3.5rem]";
const GUIAS = [0, 25, 75, 100];

export default function Explicacion({ res, sel }) {
  const { tokens, puntajes, puntaje_inicial } = res.explicabilidad;
  const filas = [...tokens].sort((a, b) => Math.abs(b.aportes[sel]) - Math.abs(a.aportes[sel]));
  const maximo = Math.max(0.0001, ...filas.map((t) => Math.abs(t.aportes[sel])));

  return (
    <Card className="mt-5 p-6">
      <Tag>Feature importance</Tag>
      <h2 className="mt-1 text-xl font-bold">Competencia entre tokens</h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-soft">
        Aporte de cada subpalabra a la categoría{" "}
        <strong className="text-foreground">{nombre(sel)}</strong>. Los valores positivos la
        impulsan; los negativos compiten en contra.
      </p>

      <div className="mt-6 border-t border-border pt-5">
        {filas.length === 0 ? (
          <p className="text-sm text-soft">El modelo no reconoció ninguna palabra de este titular.</p>
        ) : (
          <>
            <div className={`${COLS} mb-3 text-[10px] font-semibold uppercase tracking-widest text-soft`}>
              <span>Token</span>
              <span />
              <span className="text-right">Peso</span>
            </div>

            <ul className="space-y-2">
              {filas.map((t) => {
                const v = t.aportes[sel];
                const ancho = `${(Math.abs(v) / maximo) * 50}%`;
                return (
                  <li key={t.token} className={COLS}>
                    <span
                      title={t.token}
                      className="truncate rounded-md bg-surface px-2.5 py-1.5 font-mono text-xs font-semibold"
                    >
                      {t.token}
                    </span>
                    <span className="relative h-3">
                      {GUIAS.map((g) => (
                        <span
                          key={g}
                          className="absolute -inset-y-1 w-px bg-foreground/20"
                          style={{ left: `${g}%` }}
                        />
                      ))}
                      <span className="absolute -inset-y-1 left-1/2 w-px bg-foreground/60" />
                      <span
                        className={`absolute inset-y-0 rounded-sm ${v >= 0 ? "bg-positive" : "bg-negative"}`}
                        style={v >= 0 ? { left: "50%", width: ancho } : { right: "50%", width: ancho }}
                      />
                    </span>
                    <span
                      className={`text-right font-mono text-xs font-semibold tabular-nums ${v >= 0 ? "text-positive" : "text-negative"
                        }`}
                    >
                      {signado(v)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {filas.length > 0 && (
        <div className="mt-3 flex justify-end gap-4 text-xs text-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-positive" /> A favor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-negative" /> En contra
          </span>
        </div>
      )}

      <div className="mt-5 flex gap-2 border-t border-border pt-4 text-xs leading-relaxed text-soft">
        <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
        <p className="text-pretty">
          El prefijo <strong className="text-foreground">##</strong> indica que el token continúa una
          palabra. El aporte de cada token es su valor TF-IDF multiplicado por su coeficiente en la
          regresión logística. Puntaje de {nombre(sel)}: {num(puntajes[sel])} = suma de los aportes de
          todos los tokens del titular + puntaje inicial ({num(puntaje_inicial[sel])}).
        </p>
      </div>
    </Card>
  );
}
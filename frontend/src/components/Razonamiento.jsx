import Card from "./Card";
import IconInfo from "./icons/IconInfo";
import { UMBRAL_OTROS, masProbable, nombre, palabrasPorSigno } from "../utils/formato";

export default function Razonamiento({ res, sel, titular }) {
  const elegida = masProbable(res.probabilidades);
  const esOtros = res.categoria === "Otros";
  const otraCategoria = sel !== elegida;
  const { aFavor, enContra } = palabrasPorSigno(titular, res.explicabilidad.tokens, sel);
  const rojos = enContra.map((p) => ({ p, negativo: true }));
  const verdes = aFavor.map((p) => ({ p, negativo: false }));
  const tags = otraCategoria ? [...rojos, ...verdes] : [...verdes, ...rojos];
  const fuerte = "font-semibold text-foreground";

  let texto;
  if (!otraCategoria && !esOtros) {
    texto = (
      <>
        El modelo eligió <strong className={fuerte}>{nombre(sel)}</strong> porque varios términos
        del titular se asocian con esta categoría.
      </>
    );
  } else if (!otraCategoria && esOtros) {
    texto = (
      <>
        Ninguna categoría superó el {UMBRAL_OTROS * 100} % de probabilidad, por eso el titular se
        clasifica como <strong className={fuerte}>Otros</strong>. La más cercana fue{" "}
        <strong className={fuerte}>{nombre(sel)}</strong>.
      </>
    );
  } else {
    texto = (
      <>
        {esOtros ? (
          <>
            El titular se clasificó como <strong className={fuerte}>Otros</strong>; la más cercana
            fue <strong className={fuerte}>{nombre(elegida)}</strong>.
          </>
        ) : (
          <>
            El modelo clasificó el titular como <strong className={fuerte}>{nombre(elegida)}</strong>.
          </>
        )}{" "}
        Estos son los términos que lo acercan a <strong className={fuerte}>{nombre(sel)}</strong>.
      </>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <IconInfo className="h-6 w-6 text-primary" />
        <h3 className="text-sm font-bold">
          {otraCategoria ? `¿Por qué no ${nombre(sel)}?` : "¿Por qué esta predicción?"}
        </h3>
      </div>

      <p className="mt-4 text-pretty text-sm leading-relaxed text-soft">
        {texto}
        {enContra.length > 0 && " En rojo los que lo alejan."}
      </p>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map(({ p, negativo }) => (
            <li
              key={p}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${negativo ? "bg-negative text-white" : "bg-primary text-on-primary"
                }`}
            >
              {p}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
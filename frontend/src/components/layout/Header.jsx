import { useTheme } from "../../context/ThemeContext";
import IconLogo from "../icons/IconLogo";
import IconSol from "../icons/IconSol";
import IconLuna from "../icons/IconLuna";

export default function Header() {
  const { oscuro, alternar } = useTheme();
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <IconLogo className="h-10 w-10" />
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            Clasificador de Tópicos de Noticias
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={oscuro}
          aria-label="Cambiar entre modo claro y oscuro"
          onClick={alternar}
          className={`relative h-8 w-16 shrink-0 rounded-full transition-colors ${
            oscuro ? "bg-primary" : "bg-surface"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 grid h-7 w-7 place-items-center rounded-full bg-white shadow transition-transform ${
              oscuro ? "translate-x-8" : ""
            }`}
          >
            {oscuro ? <IconLuna className="h-5 w-5" /> : <IconSol className="h-5 w-5" />}
          </span>
        </button>
      </div>
    </header>
  );
}
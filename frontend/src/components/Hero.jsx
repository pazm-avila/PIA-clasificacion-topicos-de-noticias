export default function Hero() {
  return (
    <section className="pb-8 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
        Clasificación automática
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        ¿Cuál es su tópico?
      </h1>
      <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-soft">
        Ingresá el titular de una noticia en español y el modelo identificará su categoría, mostrando qué palabras influyeron en la decisión.
      </p>
    </section>
  );
}
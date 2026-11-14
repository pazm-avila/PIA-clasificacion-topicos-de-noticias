export default function Icon({ src, className = "h-5 w-5", titulo, colores = false }) {
  if (colores) {
    return (
      <img
        src={src}
        alt={titulo ?? ""}
        aria-hidden={titulo ? undefined : true}
        className={`shrink-0 object-contain ${className}`}
      />
    );
  }

  const mascara = {
    WebkitMaskImage: `url("${src}")`, maskImage: `url("${src}")`,
    WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
    WebkitMaskPosition: "center", maskPosition: "center",
    WebkitMaskSize: "contain", maskSize: "contain",
  };
  return (
    <span
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={mascara}
    />
  );
}
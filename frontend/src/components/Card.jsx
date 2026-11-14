export default function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-border bg-card ${className}`}>
      {children}
    </section>
  );
}
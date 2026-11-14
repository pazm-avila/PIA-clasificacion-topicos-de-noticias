import loading from "../../assets/loading.svg";

export default function IconCargando({ className = "h-5 w-5" }) {
  return (
    <div>
      <img src={loading} alt="Cargando icon" className={className} />
    </div>
  );
}


import sun from "../../assets/sun.svg";

export default function IconSol({ className = "h-5 w-5" }) {
  return (
    <div>
      <img src={sun} alt="Sol icon" className={className} />
    </div>
  );
}

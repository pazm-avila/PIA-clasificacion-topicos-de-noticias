import info from "../../assets/info.svg";

export default function IconInfo({ className = "h-5 w-5" }) {
  return (
    <div>
      <img src={info} alt="Info icon" className={className} />
    </div>
  );
}
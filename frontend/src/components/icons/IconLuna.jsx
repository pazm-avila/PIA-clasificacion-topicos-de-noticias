import starmoon from "../../assets/starmoon.svg";

export default function IconLuna({ className = "h-5 w-5" }) {
  return (
    <div>
      <img src={starmoon} alt="Luna icon" className={className} />
    </div>
  );
}


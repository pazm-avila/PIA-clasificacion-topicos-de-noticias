import stats from "../../assets/stats2.svg";

export default function IconLogo({ className = "h-5 w-5" }) {
  return (
    <div>
      <img src={stats} alt="Stats icon" className={className} />
    </div>
  );
}
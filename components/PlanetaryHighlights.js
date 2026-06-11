import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

const planets = [
  {
    nameKey: "planet.venus",
    statusKey: "planet.strong",
    status: "Strong",
    color: "text-green-400",
    icon: "🟣",
    noteKey: "planet.loveHarmony",
  },
  {
    nameKey: "planet.mercury",
    statusKey: "planet.weak",
    status: "Weak",
    color: "text-red-400",
    icon: "⚪",
    noteKey: "planet.avoidMiscommunication",
  },
  {
    nameKey: "planet.mars",
    statusKey: "planet.strong",
    status: "Strong",
    color: "text-green-400",
    icon: "🔴",
    noteKey: "planet.highEnergy",
  },
  {
    nameKey: "planet.jupiter",
    statusKey: "planet.strong",
    status: "Strong",
    color: "text-green-400",
    icon: "🟤",
    noteKey: "planet.growthAbundance",
  },
];

export default function PlanetaryHighlights() {
  // Show all planets if logged in, otherwise show first 3
  const { isLoggedIn } = useSelector(
    (state) => state.auth
  );
  const { t } = useLanguage();
  const visiblePlanets = isLoggedIn ? planets : planets.slice(0, 3);

  console.log(isLoggedIn);
  

  return (
    <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md h-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          {t("planet.title")}
        </h2>

        <span className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition">
          {t("quick.viewAll")} →
        </span>
      </div>

      {/* Cards */}
      <div
        className={`grid grid-cols-2 ${
          isLoggedIn ? "sm:grid-cols-4" : "sm:grid-cols-3"
        } gap-3`}
      >
        {visiblePlanets.map((planet) => (
          <div
            key={planet.nameKey}
            className="group bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:scale-[1.04] hover:border-white/20 transition-all duration-200 cursor-pointer flex flex-col items-center gap-2"
          >
            {/* Icon */}
            <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
              {planet.icon}
            </div>

            {/* Name */}
            <p className="text-sm font-semibold">{t(planet.nameKey)}</p>

            {/* Status */}
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                planet.status === "Strong"
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {planet.status === "Strong" ? "↑" : "↓"} {t(planet.statusKey)}
            </span>

            {/* Note */}
            <p className="text-[10px] text-gray-400 leading-snug">
              {t(planet.noteKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

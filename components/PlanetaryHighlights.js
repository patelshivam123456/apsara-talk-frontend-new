import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";

const planets = [
  {
    nameKey: "planet.venus",
    statusKey: "planet.strong",
    status: "Strong",
    color: "bg-[#f4d7ff] text-[#8a0ca8]",
    icon: "♀",
    noteKey: "planet.loveHarmony",
  },
  {
    nameKey: "planet.mercury",
    statusKey: "planet.weak",
    status: "Weak",
    color: "bg-[#f4ecd2] text-[#7a5400]",
    icon: "☿",
    noteKey: "planet.avoidMiscommunication",
  },
  {
    nameKey: "planet.mars",
    statusKey: "planet.strong",
    status: "Strong",
    color: "bg-[#ffe0d8] text-[#c31d11]",
    icon: "♂",
    noteKey: "planet.highEnergy",
  },
  {
    nameKey: "planet.jupiter",
    statusKey: "planet.strong",
    status: "Strong",
    color: "bg-[#ead8bd] text-[#875126]",
    icon: "♃",
    noteKey: "planet.growthAbundance",
  },
];

export default function PlanetaryHighlights() {
  // Show all planets if logged in, otherwise show first 3
  const { isLoggedIn } = useSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const { t } = useLanguage();
  const visiblePlanets = isLoggedIn ? planets.slice(0, 3) : planets.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-[26px]  bg-[#fffbea]/2  p-3 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-3">
      <div>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
              Celestial briefing
            </p>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-[#0f0a02] sm:text-3xl">
              {t("planet.title")}
            </h2>
          </div>
          <button
            onClick={() => router.push("/services/planetary-highlights")}
            className="hidden shrink-0 items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000] sm:inline-flex"
          >
            {t("quick.viewAll")} →
          </button>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${
            isLoggedIn ? "sm:grid-cols-2 md:grid-cols-3" : "md:grid-cols-3"
          }`}
        >
          {visiblePlanets.map((planet) => (
            <div
              key={planet.nameKey}
              onClick={() => router.push("/services/planetary-highlights")}
              className="group cursor-pointer flex min-h-[104px] items-center gap-4 rounded-[16px] border border-[#ffffbf]/85 bg-[#ffffbf]/20 p-4 shadow-md transition hover:-translate-y-0.5 hover:border-[#ffffbf] hover:bg-[#ffffbf]/20 hover:shadow-[0_16px_34px_rgba(126,98,10,0.18)]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ${planet.color} text-2xl font-bold shadow-[0_12px_22px_rgba(126,98,10,0.14)]`}
              >
                {planet.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-[#211704]">
                    {t(planet.nameKey)}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] ${
                      planet.status === "Strong"
                        ? "bg-[#d7efb9] text-[#236b24]"
                        : "bg-[#ffd6c7] text-[#b91c1c]"
                    }`}
                  >
                    {planet.status === "Strong" ? "↑" : "↓"} {t(planet.statusKey)}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium  text-[#6f5930]">
                  {t(planet.noteKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/services/planetary-highlights")}
          className="mt-4 inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000] sm:hidden"
        >
          {t("quick.viewAll")} →
        </button>
      </div>
    </section>
  );
}

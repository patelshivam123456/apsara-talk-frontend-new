"use client";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_SYM = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const SIGN_LORDS_ID = ["Ma","Ve","Me","Mo","Su","Me","Ve","Ma","Ju","Sa","Sa","Ju"];

const PLANETS = [
  { id:"Su", name:"Sun",     col:"#f59e0b" },
  { id:"Mo", name:"Moon",    col:"#93c5fd" },
  { id:"Ma", name:"Mars",    col:"#f87171" },
  { id:"Me", name:"Mercury", col:"#6ee7b7" },
  { id:"Ju", name:"Jupiter", col:"#fbbf24" },
  { id:"Ve", name:"Venus",   col:"#f9a8d4" },
  { id:"Sa", name:"Saturn",  col:"#94a3b8" },
  { id:"Ra", name:"Rahu",    col:"#fb923c" },
  { id:"Ke", name:"Ketu",    col:"#c084fc" },
];
const PM = Object.fromEntries(PLANETS.map(p => [p.id, p]));

const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati",
];
const NAK_LORDS = ["Ke","Ve","Su","Mo","Ma","Ra","Ju","Sa","Me","Ke","Ve","Su","Mo","Ma","Ra","Ju","Sa","Me","Ke","Ve","Su","Mo","Ma","Ra","Ju","Sa","Me"];

const DASHA_ORDER = ["Ke","Ve","Su","Mo","Ma","Ra","Ju","Sa","Me"];
const DASHA_YRS   = { Ke:7, Ve:20, Su:6, Mo:10, Ma:7, Ra:18, Ju:16, Sa:19, Me:17 };

const HOUSE_NAMES = [
  "Tanu (Self)","Dhana (Wealth)","Sahaja (Siblings)","Sukha (Home)",
  "Putra (Children)","Ripu (Enemies)","Kalatra (Partner)","Mrityu (Longevity)",
  "Dharma (Fortune)","Karma (Career)","Labha (Gains)","Vyaya (Losses)",
];

const DIGNITY_MAP = {
  Su: { exalt:0, debil:6, own:[4] },
  Mo: { exalt:1, debil:7, own:[3] },
  Ma: { exalt:9, debil:3, own:[0,7] },
  Me: { exalt:5, debil:11, own:[2,5] },
  Ju: { exalt:3, debil:9, own:[8,11] },
  Ve: { exalt:11, debil:5, own:[1,6] },
  Sa: { exalt:6, debil:0, own:[9,10] },
  Ra: { exalt:2, debil:8, own:[] },
  Ke: { exalt:8, debil:2, own:[] },
};

function dignity(pid, sign) {
  const d = DIGNITY_MAP[pid];
  if (!d) return "—";
  if (d.exalt === sign) return "Exalted ★";
  if (d.debil === sign) return "Debilitated";
  if (d.own.includes(sign)) return "Own Sign";
  return "—";
}

// ─── Astronomy ────────────────────────────────────────────────────────────────
function jDay(y, m, d, h) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + h / 24;
}

function calcChart(dob, tob) {
  const [yr, mo, dy] = dob.split("-").map(Number);
  const [hh, mm]     = tob.split(":").map(Number);
  const hour = hh + mm / 60;
  const jd   = jDay(yr, mo, dy, hour);
  const d    = jd - 2451545.0;
  const T    = d / 36525;

  // Lahiri ayanamsa (~23.85° at J2000, +50.29"/yr)
  const ayan = 23.85 + (d / 365.25) * (50.29 / 3600);

  // Sun (tropical → sidereal)
  const L0    = (280.46646  + 0.9856474  * d) % 360;
  const Msun  = ((357.52911 + 0.98560028 * d) % 360) * Math.PI / 180;
  const Csun  = 1.914602 * Math.sin(Msun) + 0.019993 * Math.sin(2 * Msun);
  const sunT  = (L0 + Csun + 360) % 360;
  const sunS  = (sunT - ayan + 360) % 360;

  // Moon
  const moonL = (218.3165 + 13.1763966 * d) % 360;
  const moonA = ((134.9629 + 13.0649929 * d) % 360) * Math.PI / 180;
  const moonT = (moonL + 6.289 * Math.sin(moonA) + 360) % 360;
  const moonS = (moonT - ayan + 360) % 360;

  // Ascendant via GMST (approximate, no location longitude)
  const GMST    = (280.46061837 + 360.98564736629 * d + 0.000387933 * T * T) % 360;
  const obl     = (23.439291 - 0.0130042 * T) * Math.PI / 180;
  const ra      = GMST * Math.PI / 180;
  const ascTrop = (Math.atan2(Math.sin(ra) * Math.cos(obl), -Math.cos(ra)) * 180 / Math.PI + 360) % 360;
  const ascS    = (ascTrop - ayan + 360) % 360;

  // Other planets (mean motions)
  const raw = {
    Me: (252.2504 + 4.09235  * d) % 360,
    Ve: (181.9798 + 1.60214  * d) % 360,
    Ma: (355.433  + 0.52402  * d) % 360,
    Ju: (34.351   + 0.08309  * d) % 360,
    Sa: (50.077   + 0.03346  * d) % 360,
    Ra: ((125.045 - 0.05295  * d) + 7200) % 360,
  };

  const sid = (lon) => { const l = ((lon % 360) + 360) % 360; return (l - ayan + 360) % 360; };
  const toSD = (lon) => { const l = ((lon % 360) + 360) % 360; return { sign: Math.floor(l / 30), deg: +(l % 30).toFixed(1) }; };

  const pos = {
    Su: toSD(sunS),
    Mo: toSD(moonS),
    Ma: toSD(sid(raw.Ma)),
    Me: toSD(sid(raw.Me)),
    Ju: toSD(sid(raw.Ju)),
    Ve: toSD(sid(raw.Ve)),
    Sa: toSD(sid(raw.Sa)),
    Ra: toSD(sid(raw.Ra)),
    Ke: toSD((sid(raw.Ra) + 180) % 360 * 30 / 30), // ketu = rahu + 180°
  };
  // Recalc Ketu properly
  pos.Ke = toSD(((sid(raw.Ra) * 30 / 30 + 180) + 360) % 360);
  // Fix: Ketu sign = Rahu sign + 6
  pos.Ke = { sign: (pos.Ra.sign + 6) % 12, deg: pos.Ra.deg };

  const ascSign = Math.floor(ascS / 30);
  const ascDeg  = +(ascS % 30).toFixed(1);

  const houses = Array.from({ length: 12 }, (_, i) => ({
    num:     i + 1,
    sign:    (ascSign + i) % 12,
    planets: Object.entries(pos)
      .filter(([, p]) => p.sign === (ascSign + i) % 12)
      .map(([id]) => id),
  }));

  // Moon nakshatra
  const nakSpan = 360 / 27;
  const nakIdx  = Math.floor(moonS / nakSpan);
  const pada    = Math.floor((moonS % nakSpan) / (nakSpan / 4)) + 1;
  const nakLord = NAK_LORDS[nakIdx];

  // Dasha balance
  const moonInNak  = moonS % nakSpan;
  const balance    = +(DASHA_YRS[nakLord] * (1 - moonInNak / nakSpan)).toFixed(2);

  // Build dasha sequence from birth
  const lordStart = DASHA_ORDER.indexOf(nakLord);
  const birthYear = yr + mo / 12 + dy / 365;
  let   cursor    = birthYear;
  const dashas    = [];
  // first dasha: partial
  dashas.push({ lord: nakLord, years: balance, start: birthYear, end: +(birthYear + balance).toFixed(2) });
  cursor = birthYear + balance;
  for (let i = 1; i <= 8; i++) {
    const lord = DASHA_ORDER[(lordStart + i) % 9];
    const yrs  = DASHA_YRS[lord];
    dashas.push({ lord, years: yrs, start: +cursor.toFixed(2), end: +(cursor + yrs).toFixed(2) });
    cursor += yrs;
  }

  return { pos, houses, ascSign, ascDeg, nakIdx, nakLord, pada, balance, dashas, yr, mo, dy };
}

// ─── North Indian Chart SVG ────────────────────────────────────────────────────
const LAYOUT = [
  { h:12, r:0, c:0 }, { h:1, r:0, c:1 }, { h:2, r:0, c:2 }, { h:3, r:0, c:3 },
  { h:11, r:1, c:0 },                                         { h:4, r:1, c:3 },
  { h:10, r:2, c:0 },                                         { h:5, r:2, c:3 },
  { h:9,  r:3, c:0 }, { h:8, r:3, c:1 }, { h:7, r:3, c:2 }, { h:6, r:3, c:3 },
];

function KundaliChart({ houses, ascSign }) {
  const S = 380, C = S / 4;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-sm mx-auto block">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#0b0f2e" />
          <stop offset="100%" stopColor="#050818" />
        </linearGradient>
        <linearGradient id="lagnaFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#3b1d8a" />
          <stop offset="100%" stopColor="#1e0f4a" />
        </linearGradient>
      </defs>

      {/* Outer background */}
      <rect width={S} height={S} rx="8" fill="url(#bg)" stroke="#2a2060" strokeWidth="1.5" />

      {LAYOUT.map(({ h, r, c }) => {
        const x = c * C, y = r * C;
        const hd = houses[h - 1];
        const isLagna = h === 1;

        // place planets in two columns inside the cell
        const pRows = [];
        for (let i = 0; i < hd.planets.length; i += 2) {
          pRows.push(hd.planets.slice(i, i + 2));
        }

        return (
          <g key={h}>
            <rect
              x={x + 1} y={y + 1} width={C - 2} height={C - 2}
              fill={isLagna ? "url(#lagnaFill)" : "rgba(13,17,64,0.7)"}
              stroke={isLagna ? "#7c3aed" : "#1b2155"}
              strokeWidth={isLagna ? 1.5 : 0.7}
              rx="2"
            />
            {/* House number */}
            <text x={x + 5} y={y + 11} fontSize="7" fill="#374170" fontFamily="Georgia,serif">{h}</text>
            {/* Sign symbol */}
            <text x={x + C / 2} y={y + 26} fontSize="13" fill={isLagna ? "#a78bfa" : "#6b7cc4"} textAnchor="middle">{SIGN_SYM[hd.sign]}</text>
            {/* Sign abbr */}
            <text x={x + C / 2} y={y + 37} fontSize="7" fill={isLagna ? "#c4b5fd" : "#4a5580"} textAnchor="middle" fontFamily="Georgia,serif">
              {SIGNS[hd.sign].substring(0, 3).toUpperCase()}
            </text>
            {/* Planets */}
            {pRows.map((row, ri) =>
              row.map((pid, ci) => (
                <text
                  key={pid}
                  x={x + (row.length === 1 ? C / 2 : ci === 0 ? C / 2 - 13 : C / 2 + 13)}
                  y={y + 51 + ri * 13}
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight="700"
                  fill={PM[pid].col}
                >
                  {pid}
                </text>
              ))
            )}
          </g>
        );
      })}

      {/* Center block */}
      <rect x={C} y={C} width={C * 2} height={C * 2} fill="#03060f" stroke="#1b2155" strokeWidth="0.7" rx="2" />
      <line x1={C + 1} y1={C + 1} x2={C * 3 - 1} y2={C * 3 - 1} stroke="#1b2155" strokeWidth="0.7" />
      <line x1={C * 3 - 1} y1={C + 1} x2={C + 1} y2={C * 3 - 1} stroke="#1b2155" strokeWidth="0.7" />
      <text x={S / 2} y={S / 2 - 12} fontSize="11" fill="#a78bfa" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="bold">
        {SIGNS[ascSign]}
      </text>
      <text x={S / 2} y={S / 2 + 3} fontSize="9" fill="#6b7cc4" textAnchor="middle" fontFamily="Georgia,serif">
        {SIGN_SYM[ascSign]} Lagna
      </text>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function KundliPage() {
  const [form, setForm]       = useState({ name:"", dob:"", time:"", place:"" });
  const [chart, setChart]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setChart(calcChart(form.dob, form.time));
      setLoading(false);
    }, 800);
  };

  return (
    <PageLayout title="Kundli / Reports" icon="📜">

      {/* ── Input Form ────────────────────────────────────────── */}
      <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 mb-6 max-w-xl">
        <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-widest mb-4">Birth Details</h2>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label:"Full Name",     key:"name",  type:"text", placeholder:"Enter your name" },
            { label:"Place of Birth",key:"place", type:"text", placeholder:"City, Country" },
            { label:"Date of Birth", key:"dob",   type:"date", placeholder:"" },
            { label:"Time of Birth", key:"time",  type:"time", placeholder:"" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-[#121735] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-white"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 transition text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </>
              ) : "Generate Kundli ✨"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Empty state ──────────────────────────────────────── */}
      {!chart && !loading && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-5xl mb-3">📜</p>
          <p className="text-sm">Enter your birth details above to generate your Vedic birth chart</p>
        </div>
      )}

      {/* ── Chart output ─────────────────────────────────────── */}
      {chart && (
        <div className="space-y-6">

          {/* Summary banner */}
          <div className="bg-linear-to-br from-purple-900/40 to-[#0f1535] border border-purple-500/30 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-lg">
                {SIGN_SYM[chart.ascSign]}
              </div>
              <div>
                <p className="text-base font-bold">{form.name || "Your Chart"}</p>
                <p className="text-xs text-gray-400">{form.dob} · {form.time} · {form.place || "—"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-auto">
              {[
                { label:"Lagna",     val:`${SIGNS[chart.ascSign]} ${chart.ascDeg}°` },
                { label:"Sun Sign",  val:`${SIGNS[chart.pos.Su.sign]} ${chart.pos.Su.deg}°` },
                { label:"Moon Sign", val:`${SIGNS[chart.pos.Mo.sign]} ${chart.pos.Mo.deg}°` },
                { label:"Nakshatra", val:`${NAKSHATRAS[chart.nakIdx]} P${chart.pada}` },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-center">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest">{label}</p>
                  <p className="text-xs font-semibold text-purple-300 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart + Planet table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* North Indian Chart */}
            <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                North Indian Birth Chart (Sidereal · Lahiri Ayanamsa)
              </p>
              <KundaliChart houses={chart.houses} ascSign={chart.ascSign} />
              {/* Planet colour legend */}
              <div className="mt-4 flex flex-wrap gap-2">
                {PLANETS.map(p => (
                  <span key={p.id} className="flex items-center gap-1 text-[10px]">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.col }} />
                    <span style={{ color: p.col }}>{p.id}</span>
                    <span className="text-gray-500">{p.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Planet details */}
            <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 overflow-x-auto">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Planetary Positions</p>
              <table className="w-full text-xs min-w-[320px]">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Planet","Sign","Deg","Nakshatra","Dignity"].map(h => (
                      <th key={h} className="text-left py-2 pr-3 text-[9px] text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLANETS.map(({ id, name }) => {
                    const p   = chart.pos[id];
                    const nak = NAKSHATRAS[Math.floor((p.sign * 30 + p.deg) / (360 / 27))];
                    const dig = dignity(id, p.sign);
                    const digColor = dig.includes("Exalted") ? "text-emerald-400" : dig.includes("Debi") ? "text-red-400" : dig.includes("Own") ? "text-blue-400" : "text-gray-500";
                    return (
                      <tr key={id} className="border-b border-white/5 hover:bg-white/3 transition">
                        <td className="py-2 pr-3">
                          <span className="font-bold" style={{ color: PM[id].col }}>{id}</span>
                          <span className="text-gray-400 ml-1.5">{name}</span>
                        </td>
                        <td className="py-2 pr-3">
                          <span className="text-purple-300">{SIGN_SYM[p.sign]}</span>
                          <span className="text-gray-300 ml-1">{SIGNS[p.sign]}</span>
                        </td>
                        <td className="py-2 pr-3 text-gray-400">{p.deg}°</td>
                        <td className="py-2 pr-3 text-gray-400">{nak}</td>
                        <td className={`py-2 text-[10px] font-medium ${digColor}`}>{dig}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* House / Bhava table */}
          <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 overflow-x-auto">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Bhava (House) Details</p>
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10">
                  {["House","Bhava","Sign","Lord","Occupants"].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-[9px] text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.houses.map((house) => {
                  const lord   = SIGN_LORDS_ID[house.sign];
                  const lordPl = PM[lord];
                  return (
                    <tr key={house.num} className="border-b border-white/5 hover:bg-white/3 transition">
                      <td className="py-2 pr-4">
                        <span className={`font-bold ${house.num === 1 ? "text-purple-400" : "text-gray-300"}`}>{house.num}</span>
                      </td>
                      <td className="py-2 pr-4 text-gray-400">{HOUSE_NAMES[house.num - 1]}</td>
                      <td className="py-2 pr-4">
                        <span className="text-purple-300 mr-1">{SIGN_SYM[house.sign]}</span>
                        <span className="text-gray-300">{SIGNS[house.sign]}</span>
                      </td>
                      <td className="py-2 pr-4 font-semibold" style={{ color: lordPl.col }}>{lord} ({lordPl.name})</td>
                      <td className="py-2">
                        {house.planets.length === 0
                          ? <span className="text-gray-600">—</span>
                          : house.planets.map(pid => (
                              <span key={pid} className="inline-block mr-2 font-bold" style={{ color: PM[pid].col }}>{pid}</span>
                            ))
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vimshottari Dasha */}
          <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 overflow-x-auto">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Vimshottari Dasha Sequence</p>
              <div className="text-right">
                <p className="text-[9px] text-gray-500">Current Mahadasha at birth</p>
                <p className="text-xs font-semibold" style={{ color: PM[chart.nakLord].col }}>
                  {PM[chart.nakLord].name} · Balance {chart.balance} yrs
                </p>
              </div>
            </div>
            <table className="w-full text-xs min-w-[360px]">
              <thead>
                <tr className="border-b border-white/10">
                  {["Mahadasha Lord","Period (yrs)","From","To"].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-[9px] text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.dashas.map((d, i) => {
                  const pl   = PM[d.lord];
                  const from = Math.floor(d.start);
                  const to   = Math.floor(d.end);
                  const isCurrent = i === 0;
                  return (
                    <tr key={i} className={`border-b border-white/5 ${isCurrent ? "bg-purple-900/20" : "hover:bg-white/3"} transition`}>
                      <td className="py-2.5 pr-4">
                        <span className="font-bold text-sm" style={{ color: pl.col }}>{d.lord}</span>
                        <span className="text-gray-400 ml-2">{pl.name}</span>
                        {isCurrent && <span className="ml-2 text-[9px] bg-purple-600/30 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded-full">Balance at birth</span>}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-400">{d.years}</td>
                      <td className="py-2.5 pr-4 text-gray-300">{from}</td>
                      <td className="py-2.5 text-gray-300">{to}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Download button */}
          <button className="w-full py-3 rounded-2xl border border-purple-500/30 text-purple-400 text-sm font-semibold hover:bg-purple-600/10 transition flex items-center justify-center gap-2">
            ⬇ Download Full PDF Report
          </button>

        </div>
      )}
    </PageLayout>
  );
}

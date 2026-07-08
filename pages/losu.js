"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageLayout from "@/components/PageLayout";
import "react-toastify/dist/ReactToastify.css";

const rowOrder = [
  ["topRow", "Top Row"],
  ["middleRow", "Middle Row"],
  ["bottomRow", "Bottom Row"],
];

const currentYear = new Date().getFullYear();

const calculationOptions = [
  { value: "lo-shu-grid", label: "Lu Shu Grid (1)" },
  { value: "vedic-grid", label: "Vedic Grid (2)" },
  { value: "pythagoras-grid", label: "Pythagoras Grid (3)" },
  { value: "name-frequency", label: "Name Frequency (4)" },
  { value: "daily-numeroscope", label: "Daily Numeroscope (5)" },
  { value: "relationship", label: "Relationship (6)" },
  { value: "mobile-number-numerology", label: "Mobile Number Numerology (7)" },
  { value: "switch-code", label: "Switch Code (8)" },
  { value: "yantra", label: "Yantra (9)" },
];

const personalYearReadingDetails = [
  "This year will require a lot of hard work & results will be according to your hard work.",
  "Lot of hard work will be required to achieve your goals.",
  "It's a favourable time for you to buy or sell property.",
  "You may become workaholic this year and may invest significant time & energy of getting the work done.",
  "Health issues may also be occur, so better to take care of yourself.",
  "If any fund is stuck somewhere or with someone, this is the best time to recover your fund.",
  "Avoid business expansion this year and focus on strengthening the existing venture.",
  "Valuable connections with people may be established.",
  "Hard work done this year will give result in coming year.",
];

const personalityDestinyTabs = [
  { key: "personality", label: "Personality", type: "PERSONALITY" },
  { key: "destiny", label: "Destiny", type: "DESTINY" },
];

const preferredPersonalityDestinySections = [
  { key: "coreCharacteristics", label: "Core Characteristics" },
  { key: "commonPitfalls", label: "Common Pitfalls" },
  {
    key: "primaryHealthVulnerabilities",
    label: "Primary Health Vulnerabilities",
  },
  { key: "topCareerRoles", label: "Top Career Roles" },
  { key: "topCareerSectors", label: "Top Career Sectors" },
];

function formatList(values) {
  return values?.length ? values.join(", ") : "None";
}

function formatDobForApi(value) {
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function normalizeMatrixResult(result) {
  const data = result?.data || result;
  return Array.isArray(data) ? data : data?.matrix || data?.years || [];
}

function formatPersonalityDestinySectionLabel(key) {
  const preferredSection = preferredPersonalityDestinySections.find(
    (section) => section.key === key,
  );

  if (preferredSection) {
    return preferredSection.label;
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();
}

function normalizePersonalityDestinyResult(result) {
  const data = result?.data || result || {};
  const preferredKeys = preferredPersonalityDestinySections.map(
    (section) => section.key,
  );

  return Object.entries(data)
    .filter(([, value]) => Array.isArray(value))
    .sort(([keyA], [keyB]) => {
      const indexA = preferredKeys.indexOf(keyA);
      const indexB = preferredKeys.indexOf(keyB);

      if (indexA === -1 && indexB === -1) {
        return keyA.localeCompare(keyB);
      }

      if (indexA === -1) {
        return 1;
      }

      if (indexB === -1) {
        return -1;
      }

      return indexA - indexB;
    })
    .map(([key, value]) => ({
      key,
      label: formatPersonalityDestinySectionLabel(key),
      items: value.filter((item) => item?.value),
    }));
}

async function fetchPersonalityDestinyDetails(type, number) {
  const query = new URLSearchParams({
    type,
    number: String(number),
  });

  const response = await fetch(
    `/api/astro-proxy/astrology-services/home-page/personality-destiny-details?${query.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || `Unable to generate ${type.toLowerCase()} details.`,
    );
  }

  return normalizePersonalityDestinyResult(result);
}

export default function LosuPage() {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [fromYear, setFromYear] = useState(String(currentYear));
  const [toYear, setToYear] = useState(String(currentYear + 10));
  const [calculationType, setCalculationType] = useState("lo-shu-grid");
  const [losuResult, setLosuResult] = useState(null);
  const [personalYearResult, setPersonalYearResult] = useState(null);
  const [personalYearMatrix, setPersonalYearMatrix] = useState([]);
  const [personalityDestinyDetails, setPersonalityDestinyDetails] = useState({
    personality: null,
    destiny: null,
  });
  const [activePersonalityDestinyTab, setActivePersonalityDestinyTab] =
    useState("personality");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const hasResults = Boolean(losuResult && personalYearResult);
  const countEntries = losuResult?.counts
    ? Object.entries(losuResult.counts)
    : [];
  const summaryCards = [
    {
      label: "Date of Birth",
      value: losuResult?.dob,
      detail: "Source date used for numerology calculation",
    },
    {
      label: "Personality Number",
      value: losuResult?.driverNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Destiny Number",
      value: losuResult?.destinyNumber,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
  ];

  const summaryCardsSecond = [
    {
      label: "kua Number",
      value: losuResult?.kuaNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Name Number",
      value: losuResult?.nameNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Running Age",
      value: losuResult?.runningAge,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Zodiac Number",
      value: losuResult?.zodiacNumber,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Zodiac Sign",
      value: losuResult?.zodiacSign,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
  ];
  const activePersonalityDestinyDetails =
    personalityDestinyDetails[activePersonalityDestinyTab];
  const activePersonalityDestinyMeta =
    personalityDestinyTabs.find(
      (tab) => tab.key === activePersonalityDestinyTab,
    ) || personalityDestinyTabs[0];
  const activePersonalityDestinyNumber =
    activePersonalityDestinyTab === "personality"
      ? losuResult?.driverNumber
      : losuResult?.destinyNumber;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (calculationType !== "lo-shu-grid") {
      const nextMessage = "Please select Lu Shu Grid.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (!fullName.trim()) {
      const nextMessage = "Please enter full name.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (!gender.trim()) {
      const nextMessage = "Please select gender.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (!dob.trim()) {
      const nextMessage = "Please enter date of birth.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (!fromYear.trim() || !toYear.trim()) {
      const nextMessage = "Please enter from year and to year.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    const fromYearNumber = Number(fromYear);
    const toYearNumber = Number(toYear);

    if (!Number.isInteger(fromYearNumber) || !Number.isInteger(toYearNumber)) {
      const nextMessage = "Please enter valid years.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (toYearNumber < fromYearNumber) {
      const nextMessage = "To Year must be greater than or equal to From Year.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (toYearNumber - fromYearNumber > 10) {
      const nextMessage = "Maximum gap between From Year and To Year is 10 years.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      setLosuResult(null);
      setPersonalYearResult(null);
      setPersonalYearMatrix([]);
      setPersonalityDestinyDetails({
        personality: null,
        destiny: null,
      });
      setActivePersonalityDestinyTab("personality");
      const normalizedDob = formatDobForApi(dob.trim());

      const response = await fetch(
        "/api/astro-proxy/astrology-services/home-page/lo-shu-grid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            dob: normalizedDob,
            fullName: fullName.trim(),
            gender,
          }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to generate numerology grid.");
      }

      const nextResult = result?.data || result;

      if (!nextResult?.grid || !nextResult?.counts) {
        throw new Error(result?.message || "Invalid numerology grid response.");
      }

      const personalYearRequest = fetch(
        "/api/astro-proxy/astrology-services/home-page/personal-year",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            dob: normalizedDob,
            fullName: fullName.trim(),
            gender,
          }),
        },
      );
      const matrixQuery = new URLSearchParams({
        dob: normalizedDob,
        fromYear: String(fromYearNumber),
        toYear: String(toYearNumber),
      });
      const matrixRequest = fetch(
        `/api/astro-proxy/astrology-services/home-page/personal-year-matrix?${matrixQuery.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      const personalityRequest = fetchPersonalityDestinyDetails(
        "PERSONALITY",
        nextResult.driverNumber,
      );
      const destinyRequest = fetchPersonalityDestinyDetails(
        "DESTINY",
        nextResult.destinyNumber,
      );

      const [
        personalYearResponse,
        matrixResponse,
        personalityDetails,
        destinyDetails,
      ] = await Promise.all([
        personalYearRequest,
        matrixRequest,
        personalityRequest,
        destinyRequest,
      ]);
      const personalYearResult = await personalYearResponse.json();

      if (!personalYearResponse.ok) {
        throw new Error(
          personalYearResult?.message ||
            "Unable to generate personal year details.",
        );
      }

      const nextPersonalYearResult =
        personalYearResult?.data || personalYearResult;

      if (
        !nextPersonalYearResult ||
        nextPersonalYearResult.personalMonth === undefined ||
        nextPersonalYearResult.personalDay === undefined ||
        nextPersonalYearResult.personalYear === undefined
      ) {
        throw new Error(
          personalYearResult?.message ||
            "Invalid personal year details response.",
        );
      }

      const matrixResult = await matrixResponse.json();

      if (!matrixResponse.ok) {
        throw new Error(
          matrixResult?.message || "Unable to generate personal year matrix.",
        );
      }

      const nextMatrixResult = normalizeMatrixResult(matrixResult);

      if (!Array.isArray(nextMatrixResult)) {
        throw new Error(
          matrixResult?.message || "Invalid personal year matrix response.",
        );
      }

      setLosuResult(nextResult);
      setPersonalYearResult(nextPersonalYearResult);
      setPersonalYearMatrix(nextMatrixResult);
      setPersonalityDestinyDetails({
        personality: personalityDetails,
        destiny: destinyDetails,
      });
      const nextMessage = "Numerology data generated successfully.";
      setMessage(nextMessage);
      toast.success(result?.message || nextMessage);
    } catch (error) {
      const nextMessage =
        error?.message || "Unable to generate numerology data. Please try again.";
      setMessage(nextMessage);
      toast.error(nextMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

 const personalYearMatrixApi = async () => {
  if (!fromYear.trim() || !toYear.trim()) {
      const nextMessage = "Please enter from year and to year.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    const fromYearNumber = Number(fromYear);
    const toYearNumber = Number(toYear);

    if (!Number.isInteger(fromYearNumber) || !Number.isInteger(toYearNumber)) {
      const nextMessage = "Please enter valid years.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (toYearNumber < fromYearNumber) {
      const nextMessage = "To Year must be greater than or equal to From Year.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    if (toYearNumber - fromYearNumber > 10) {
      const nextMessage = "Maximum gap between From Year and To Year is 10 years.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      const normalizedDob = formatDobForApi(dob.trim());

    const matrixQuery = new URLSearchParams({
      dob: normalizedDob,
      fromYear: String(fromYearNumber),
      toYear: String(toYearNumber),
    });

    const matrixResponse = await fetch(
      `/api/astro-proxy/astrology-services/home-page/personal-year-matrix?${matrixQuery.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const matrixResult = await matrixResponse.json();

    if (!matrixResponse.ok) {
      throw new Error(
        matrixResult?.message || "Unable to generate personal year matrix."
      );
    }

    const nextMatrixResult = normalizeMatrixResult(matrixResult);

    if (!Array.isArray(nextMatrixResult)) {
      throw new Error(
        matrixResult?.message || "Invalid personal year matrix response."
      );
    }

    setPersonalYearMatrix(nextMatrixResult);

    const nextMessage = "Personal year matrix generated successfully.";
    setMessage(nextMessage);
    toast.success(matrixResult?.message || nextMessage);
  } catch (error) {
    const nextMessage =
      error?.message ||
      "Unable to generate personal year matrix. Please try again.";

    setMessage(nextMessage);
    toast.error(nextMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <PageLayout title="Numerology Details" icon="🔢">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <div className="mx-auto max-w-7xl">
        <section className="rounded-xl border border-white/10 bg-[#0f1535] p-3 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg  p-2.5 transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="losu-fullname"
                  className="text-xs uppercase tracking-[0.14em] text-gray-400"
                >
                  Full Name
                </label>

                <input
                  id="losu-fullname"
                  type="text"
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-[#d8a84a]/70"
                />
              </div>

              <div>
                <label
                  htmlFor="losu-gender"
                  className="text-xs uppercase tracking-[0.14em] text-gray-400"
                >
                  Gender
                </label>

                <select
                  id="losu-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm outline-none transition focus:border-[#d8a84a]/70"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="losu-dob"
                  className="text-xs uppercase tracking-[0.14em] text-gray-400"
                >
                  Enter DOB
                </label>

                <input
                  id="losu-dob"
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-[#d8a84a]/70"
                />
              </div>

              <div>
                <label
                  htmlFor="losu-calculation-type"
                  className="text-xs uppercase tracking-[0.14em] text-gray-400"
                >
                  Calculation
                </label>

                <select
                  id="losu-calculation-type"
                  value={calculationType}
                  onChange={(event) => setCalculationType(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm outline-none transition focus:border-[#d8a84a]/70"
                >
                  {calculationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div className="mt-4 rounded-lg border border-[#d8a84a]/30 bg-[#fff8ee] p-3 text-[#211704]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
                  Matrix for Personal Year & Month
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[360px]">
                  <div>
                    <label
                      htmlFor="losu-from-year"
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]"
                    >
                      From Year
                    </label>

                    <input
                      id="losu-from-year"
                      type="number"
                      inputMode="numeric"
                      value={fromYear}
                      onChange={(event) => setFromYear(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[#d8a84a]/50 bg-white px-3 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="losu-to-year"
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]"
                    >
                      To Year
                    </label>

                    <input
                      id="losu-to-year"
                      type="number"
                      inputMode="numeric"
                      value={toYear}
                      onChange={(event) => setToYear(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[#d8a84a]/50 bg-white px-3 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
                    />
                  </div>
                </div>
              </div>
            </div> */}

            <div className="mt-4 flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
              >
                {isSubmitting ? "Generating..." : "Submit"}
              </button>
            </div>
            {message && <p className="mt-2 text-xs text-green-700 sm:text-end">{message}</p>}
          </form>

          {hasResults && (
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1fr]">
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {summaryCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-2.5 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8a6106]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#211704]">
                        {item.value}
                      </p>
                      <p className="mt-0.5 text-xs text-[#665d4d]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Personal Year", personalYearResult.personalYear],
                    ["Personal Month", personalYearResult.personalMonth],
                    ["Personal Day", personalYearResult.personalDay],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-purple-300/30 bg-purple-500/15 p-2.5 text-center transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-[10px] uppercase tracking-[0.12em] text-purple-100">
                        {label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#17112f] p-2.5 transition-all duration-200 hover:scale-[1.01]">
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                      Missing Numbers
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {formatList(losuResult.missingNumbers)}
                    </p>
                  </div>
                  <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#17112f] p-2.5 transition-all duration-200 hover:scale-[1.01]">
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                      Repeated Numbers
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {formatList(losuResult.repeatedNumbers)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#d8a84a]/40 bg-[#fff8ee] p-3 transition-all duration-200 hover:scale-[1.01]">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#211704]">
                      Number Counts
                    </h3>
                    <span className="rounded-full border border-[#d8a84a]/40 bg-[#fdefd4] px-3 py-1 text-xs text-[#8a6106]">
                      1 to 9
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9 lg:grid-cols-3">
                    {countEntries.map(([number, count]) => (
                      <div
                        key={number}
                        className="astro-dark-surface rounded-md border border-white/10 bg-[#10162f] px-1.5 py-1 text-center transition-all duration-200 hover:scale-[1.01]"
                      >
                        <p className="text-xs text-gray-400">No. {number}</p>
                        <p className="text-sm font-semibold text-white md:text-base">
                          {count}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#090d22]/80 p-3 transition-all duration-200 hover:scale-[1.01]">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
                      Grid placement
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Numerology Grid
                    </h3>
                  </div>
                  <span className="rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
                    Astrologer view
                  </span>
                </div>

                <div className="mx-auto grid aspect-square w-full max-w-[320px] grid-rows-3 overflow-hidden rounded-2xl border border-[#d8a84a]/60 shadow-[inset_0_0_48px_rgba(216,168,74,0.12)]">
                  {rowOrder.map(([rowKey]) => (
                    <div key={rowKey} className="grid grid-cols-3">
                      {losuResult.grid[rowKey].map((value, index) => (
                        <div
                          key={`${rowKey}-${index}`}
                          className="flex items-center justify-center border border-[#d8a84a]/45"
                        >
                          <span
                            className={`text-2xl font-bold ${
                              value ? "text-[#f0c040]" : "text-white/20"
                            }`}
                          >
                            {value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {rowOrder.map(([rowKey, rowLabel]) => (
                    <div
                      key={rowKey}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                        {rowLabel}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-white">
                        {losuResult.grid[rowKey]
                          .map((value) => value || "Empty")
                          .join(" / ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1  gap-2 sm:grid-cols-3 lg:grid-cols-2">
                  {summaryCardsSecond.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-2.5 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8a6106]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#211704]">
                        {item.value}
                      </p>
                      {/* <p className="mt-0.5 text-xs text-[#665d4d]">
                        {item.detail}
                      </p> */}
                    </div>
                  ))}
                </div>

              <div className="lg:col-span-2 mt-5">
                <div className="mb-3 astro-dark-surface rounded-xl border border-white/10 bg-[#090d22]/80 p-3 transition-all duration-200 hover:scale-[1.01] flex justify-between flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
                      Numerology insight
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Personality and Destiny Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 overflow-hidden rounded-lg border border-[#d8a84a]/40 bg-white/5 p-1">
                    {personalityDestinyTabs.map((tab) => {
                      const isActive = activePersonalityDestinyTab === tab.key;

                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActivePersonalityDestinyTab(tab.key)}
                          className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "bg-[#d8a84a] text-[#211704]"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {(activePersonalityDestinyDetails || []).map((section) => {
                    return (
                      <article
                        key={section.key}
                        className="rounded-sm border-2 border-[#39d74a] bg-[#fffed5] p-3 text-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
                      >
                        <div className="rounded-md border border-[#39d74a]/70 bg-[#cff5bd] px-3 py-2 text-center">
                          <h4 className="text-sm font-bold leading-tight text-[#075a22]">
                            {section.label} of {activePersonalityDestinyMeta.label}{" "}
                            Number {activePersonalityDestinyNumber}
                          </h4>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#075a22]">
                          {section.items[0]?.lord && (
                            <span className="text-[10px] rounded-full border border-[#39d74a]/60 bg-white/70 px-2 py-1">
                              Lord: {section.items[0].lord}
                            </span>
                          )}
                          {section.items[0]?.colour && (
                            <span className="text-[10px] rounded-full border border-[#39d74a]/60 bg-white/70 px-2 py-1">
                              Colour: {section.items[0].colour}
                            </span>
                          )}
                        </div>

                        {section.items.length > 0 ? (
                          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[12px] leading-snug">
                            {section.items.map((item, index) => (
                              <li key={`${section.key}-${index}`}>
                                {item.value}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-sm font-semibold text-[#665d4d]">
                            No details available for this number.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:col-span-2 xl:grid-cols-[4fr_2fr]">
                <div className="overflow-hidden rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-2 text-[#111]">
                  <div className="mt-4 rounded-lg border border-[#d8a84a]/30 bg-[#fff8ee] p-3 text-[#211704]">
             
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
                  Matrix for Personal Year & Month
                </h3>
 <div className="sm:flex justify-between gap-3 lg:flex-row lg:items-end lg:justify-between mt-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[360px]">
                  <div>
                    <label
                      htmlFor="losu-from-year"
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]"
                    >
                      From Year
                    </label>

                    <input
                      id="losu-from-year"
                      type="number"
                      inputMode="numeric"
                      value={fromYear}
                      onChange={(event) => setFromYear(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[#d8a84a]/50 bg-white px-3 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="losu-to-year"
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]"
                    >
                      To Year
                    </label>

                    <input
                      id="losu-to-year"
                      type="number"
                      inputMode="numeric"
                      value={toYear}
                      onChange={(event) => setToYear(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[#d8a84a]/50 bg-white px-3 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
                    />
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
              <button
                onClick={()=>personalYearMatrixApi()}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
              >
                {isSubmitting ? "Generating..." : "Submit"}
              </button>
            </div>
              </div>
            </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-[760px] border-collapse text-center text-sm font-semibold">
                      <thead>
                        <tr>
                          <th
                            rowSpan="2"
                            className="border border-[#333] bg-[#ffd957] px-3 py-3"
                          >
                            Year
                          </th>
                          <th
                            rowSpan="2"
                            className="border border-[#333] bg-[#ffd957] px-3 py-3"
                          >
                            Personal
                            <br />
                            Year
                          </th>
                          <th
                            colSpan="12"
                            className="border border-[#333] bg-[#ffd957] px-3 py-3"
                          >
                            Personal Month
                          </th>
                        </tr>
                        <tr>
                          {[
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ].map((month) => (
                            <th
                              key={month}
                              className="border border-[#333] bg-[#f7f7f7] px-3 py-2"
                            >
                              {month}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {personalYearMatrix.map((item) => (
                          <tr key={item.year}>
                            <td className="border border-[#333] bg-[#f7f7f7] px-3 py-2">
                              {item.year}
                            </td>
                            <td className="border border-[#333] bg-[#f7f7f7] px-3 py-2 text-lg">
                              <span className="text-red-600">
                                {String(item.personalYear || "").split("/")[0]?.trim()}
                              </span>
                              <span className="px-1 text-black">/</span>
                              <span className="text-green-700">
                                {String(item.personalYear || "").split("/")[1]?.trim()}
                              </span>
                            </td>
                            {item.months?.map((month) => (
                              <td
                                key={`${item.year}-${month.month}`}
                                className="border border-[#333] bg-[#f7f7f7] px-3 py-2 text-base"
                              >
                                {month.personalMonth}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <aside className="rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-3 text-[#111]">
                  <h3 className="text-lg font-semibold leading-tight">
                    Personal Year reading
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-tight">
                    <li className="text-[13px]">
                      Your running personal year is{" "}
                      {personalYearResult.personalYear}.
                    </li>
                    {personalYearReadingDetails.map((item) => (
                      <li className="text-[13px]" key={item}>{item}</li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

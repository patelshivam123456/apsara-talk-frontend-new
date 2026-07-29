"use client";

import { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageLayout from "@/components/PageLayout";
import apisecond from "@/utils/apisecond";
import "react-toastify/dist/ReactToastify.css";
import LushuForm from "./Lushu-grid/LushuForm";
import LushuGridPage from "./Lushu-grid/LushuGridPage";
import VedicGridPage from "./Vedic-grid";
import GenericNumerologyResult from "./GenericNumerologyResult";
import { currentYear } from "./Lushu-grid/constants";
import {
  formatDobForApi,
  normalizeMatrixResult,
} from "./Lushu-grid/helpers";
import {
  fetchLoShuRepetitionEffects,
  fetchNumberRelationships,
  fetchPersonalityDestinyDetails,
  fetchSectorWiseEffects,
} from "./Lushu-grid/api";

const maxDashaDisplayDate = "31-12-2060";
const defaultPratyantarFromDate = "01-01-2021";
const fixedPratyantarYears = "10";

function parseDisplayDate(value) {
  if (!value) {
    return null;
  }

  const parts = String(value).includes("/")
    ? String(value).split("/")
    : String(value).split("-");

  if (parts.length !== 3) {
    return null;
  }

  let day;
  let month;
  let year;

  if (parts[0].length === 4) {
    [year, month, day] = parts;
  } else {
    [day, month, year] = parts;
  }

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

function formatDisplayDate(value) {
  const date = value instanceof Date ? value : parseDisplayDate(value);

  if (!date) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
}

function compareDates(left, right) {
  const leftDate = left instanceof Date ? left : parseDisplayDate(left);
  const rightDate = right instanceof Date ? right : parseDisplayDate(right);

  if (!leftDate || !rightDate) {
    return Number.NaN;
  }

  return leftDate.getTime() - rightDate.getTime();
}

function getYear(value) {
  const date = value instanceof Date ? value : parseDisplayDate(value);
  return date ? date.getFullYear() : Number.NaN;
}

function isDateWithinRange(value, min, max) {
  return compareDates(value, min) >= 0 && compareDates(value, max) <= 0;
}

function formatDateForPratyantarApi(value) {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value.replaceAll("/", "-");
  }

  return value;
}

function getPratyantarInitialFromDate(sourceDob) {
  const dobDate = parseDisplayDate(sourceDob);
  const defaultDate = parseDisplayDate(defaultPratyantarFromDate);

  if (!dobDate || !defaultDate) {
    return defaultPratyantarFromDate;
  }

  return dobDate.getTime() > defaultDate.getTime()
    ? formatDisplayDate(dobDate)
    : defaultPratyantarFromDate;
}

function normalizePratyantarDashaResult(result) {
  const data = result?.data || result;
  return Array.isArray(data) ? data : [];
}

function normalizeDashaCalculationResult(result) {
  return result?.data || result || {};
}

function flattenDashaRows(mahadashas = [], selectedFromDate, selectedToDate) {
  const selectedFrom = parseDisplayDate(selectedFromDate);
  const selectedTo = parseDisplayDate(selectedToDate);
  const seenRows = new Set();

  if (!selectedFrom || !selectedTo) {
    return [];
  }

  return mahadashas
    .flatMap((mahadasha, mahaIndex) =>
      (mahadasha.antardashas || []).map((antardasha, antarIndex) => {
        const startDate = parseDisplayDate(antardasha.startDate);
        const endDate = parseDisplayDate(antardasha.endDate);

        return {
          id: `${mahaIndex}-${antarIndex}-${antardasha.startDate}-${antardasha.endDate}`,
          fromDate: antardasha.startDate,
          toDate: antardasha.endDate,
          mahadashaNumber:
            antardasha.mahadashaNumber ?? mahadasha.mahadashaNumber,
          antardashaNumber: antardasha.antardashaNumber,
          startTimestamp: startDate?.getTime(),
          endTimestamp: endDate?.getTime(),
        };
      }),
    )
    .filter((row) => {
      if (
        !Number.isFinite(row.startTimestamp) ||
        !Number.isFinite(row.endTimestamp)
      ) {
        return false;
      }

      return (
        row.startTimestamp <= selectedTo.getTime() &&
        row.endTimestamp >= selectedFrom.getTime()
      );
    })
    .sort((left, right) => left.startTimestamp - right.startTimestamp)
    .filter((row) => {
      const rowKey = [
        row.fromDate,
        row.toDate,
        row.mahadashaNumber,
        row.antardashaNumber,
      ].join("|");

      if (seenRows.has(rowKey)) {
        return false;
      }

      seenRows.add(rowKey);
      return true;
    });
}

export default function NumerologyPage() {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [fromYear, setFromYear] = useState(String(currentYear));
  const [toYear, setToYear] = useState(String(currentYear + 10));
  const [dashaRows, setDashaRows] = useState([]);
  const [calculationType, setCalculationType] = useState("lo-shu-grid");
  const [activeResultType, setActiveResultType] = useState("");
  const [losuResult, setLosuResult] = useState(null);
  const [vedicResult, setVedicResult] = useState(null);
  const [personalYearResult, setPersonalYearResult] = useState(null);
  const [personalYearMatrix, setPersonalYearMatrix] = useState([]);
  const [pratyantarDasha, setPratyantarDasha] = useState([]);
  const [personalityDestinyDetails, setPersonalityDestinyDetails] = useState({
    personality: null,
    destiny: null,
  });
  const [numberRelationships, setNumberRelationships] = useState([]);
  const [sectorWiseEffects, setSectorWiseEffects] = useState(null);
  const [loShuRepetitionEffects, setLoShuRepetitionEffects] = useState([]);
  const [activePersonalityDestinyTab, setActivePersonalityDestinyTab] =
    useState("personality");
  const [activeSectorEffectTab, setActiveSectorEffectTab] =
    useState("careerEffect");
  const [genericResult, setGenericResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const resetResults = () => {
    setActiveResultType("");
    setLosuResult(null);
    setVedicResult(null);
    setPersonalYearResult(null);
    setPersonalYearMatrix([]);
    setPratyantarDasha([]);
    setDashaRows([]);
    setPersonalityDestinyDetails({
      personality: null,
      destiny: null,
    });
    setNumberRelationships([]);
    setSectorWiseEffects(null);
    setLoShuRepetitionEffects([]);
    setGenericResult(null);
    setActivePersonalityDestinyTab("personality");
    setActiveSectorEffectTab("careerEffect");
  };

  const validateCommonFields = () => {
    if (!fullName.trim()) {
      return "Please enter full name.";
    }

    if (!gender.trim()) {
      return "Please select gender.";
    }

    if (!dob.trim()) {
      return "Please enter date of birth.";
    }

    return "";
  };

  const validateYearRange = () => {
    if (!fromYear.trim() || !toYear.trim()) {
      return "Please enter from year and to year.";
    }

    const fromYearNumber = Number(fromYear);
    const toYearNumber = Number(toYear);

    if (!Number.isInteger(fromYearNumber) || !Number.isInteger(toYearNumber)) {
      return "Please enter valid years.";
    }

    if (toYearNumber < fromYearNumber) {
      return "To Year must be greater than or equal to From Year.";
    }

    if (toYearNumber - fromYearNumber > 10) {
      return "Maximum gap between From Year and To Year is 10 years.";
    }

    return "";
  };

  const showValidationError = (nextMessage) => {
    setMessage(nextMessage);
    toast.error(nextMessage);
  };

  const validateDashaDateFields = (sourceDob, fromDate, toDate) => {
    const displayDob = formatDisplayDate(sourceDob);
    const displayFromDate = formatDisplayDate(fromDate);
    const displayToDate = formatDisplayDate(toDate);

    if (!displayFromDate) {
      return "Please select a valid From Date.";
    }

    if (!displayToDate) {
      return "Please select a valid To Date.";
    }

    if (getYear(displayToDate) > 2060) {
      return "To Date cannot be later than 31-12-2060.";
    }

    if (!isDateWithinRange(displayFromDate, displayDob, maxDashaDisplayDate)) {
      return "From Date cannot be earlier than Date of Birth.";
    }

    if (compareDates(displayFromDate, displayToDate) > 0) {
      return "From Date cannot be later than To Date.";
    }

    if (compareDates(displayToDate, maxDashaDisplayDate) > 0) {
      return "To Date cannot be later than 31-12-2060.";
    }

    return "";
  };

  const fetchDashaCalculation = async (sourceDob, fromDate, toDate) => {
    const displayDob = formatDisplayDate(sourceDob);
    const displayFromDate = formatDisplayDate(fromDate);
    const displayToDate = formatDisplayDate(toDate);

    const dashaError = validateDashaDateFields(
      displayDob,
      displayFromDate,
      displayToDate,
    );

    if (dashaError) {
      throw new Error(dashaError);
    }

    const result = await apisecond.get(
      "/astrology-services/home-page/numerology/dasha-calculation",
      {
        params: {
          dateOfBirth: displayDob,
          fromDate: displayFromDate,
          toDate: displayToDate,
        },
      },
    );
    const nextResult = normalizeDashaCalculationResult(result);
    const nextRows = flattenDashaRows(
      nextResult.mahadashas,
      displayFromDate,
      displayToDate,
    );

    return nextRows;
  };

  const fetchPratyantarDasha = useCallback(async (
    sourceDob,
    fromDate = defaultPratyantarFromDate,
  ) => {
    const query = new URLSearchParams({
      dateOfBirth: formatDateForPratyantarApi(sourceDob),
      fromDate: formatDateForPratyantarApi(fromDate),
      years: fixedPratyantarYears,
    });

    const response = await fetch(
      `/api/astro-proxy/astrology-services/home-page/numerology/pratyantar-dasha?${query.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message || "Unable to generate Pratyantar Dasha chart.",
      );
    }

    const nextResult = normalizePratyantarDashaResult(result);

    if (!Array.isArray(nextResult)) {
      throw new Error(
        result?.message || "Invalid Pratyantar Dasha chart response.",
      );
    }

    return nextResult;
  }, []);

  const generateLoShuGrid = async (normalizedDob, fromYearNumber, toYearNumber) => {
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
    const numberRelationshipsRequest = fetchNumberRelationships(
      nextResult.driverNumber,
      nextResult.destinyNumber,
    );
    const sectorWiseEffectsRequest = fetchSectorWiseEffects(
      nextResult.driverNumber,
      nextResult.destinyNumber,
    );
    const loShuRepetitionEffectsRequest = fetchLoShuRepetitionEffects(
      nextResult.counts,
    );

    const [
      personalYearResponse,
      matrixResponse,
      personalityDetails,
      destinyDetails,
      nextNumberRelationships,
      nextSectorWiseEffects,
      nextLoShuRepetitionEffects,
    ] = await Promise.all([
      personalYearRequest,
      matrixRequest,
      personalityRequest,
      destinyRequest,
      numberRelationshipsRequest,
      sectorWiseEffectsRequest,
      loShuRepetitionEffectsRequest,
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
    setNumberRelationships(nextNumberRelationships);
    setSectorWiseEffects(nextSectorWiseEffects);
    setLoShuRepetitionEffects(nextLoShuRepetitionEffects);
    setActiveResultType("lo-shu-grid");
    return result?.message || "Numerology data generated successfully.";
  };

  const generateGenericNumerology = async (normalizedDob) => {
    const response = await fetch(
      `/api/astro-proxy/astrology-services/home-page/${calculationType}`,
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
      throw new Error(result?.message || "Unable to generate selected numerology data.");
    }

    setGenericResult(result);
    setActiveResultType(calculationType);
    return result?.message || "Numerology data generated successfully.";
  };

  const generateVedicGrid = async (normalizedDob) => {
    const response = await fetch(
      "/api/astro-proxy/astrology-services/home-page/vedic-grid",
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
      throw new Error(result?.message || "Unable to generate Vedic grid.");
    }

    const nextResult = result?.data || result;

    if (!nextResult?.grid || !nextResult?.counts) {
      throw new Error(result?.message || "Invalid Vedic grid response.");
    }

    const displayDob = formatDisplayDate(nextResult.dob || normalizedDob);
    const defaultFromDate = displayDob;
    const defaultToDate = maxDashaDisplayDate;

    const [
      nextNumberRelationships,
      nextPratyantarDasha,
      nextDashaRows,
    ] = await Promise.all([
      fetchNumberRelationships(nextResult.driverNumber, nextResult.destinyNumber),
      fetchPratyantarDasha(
        nextResult.dob || normalizedDob,
        getPratyantarInitialFromDate(nextResult.dob || normalizedDob),
      ),
      fetchDashaCalculation(displayDob, defaultFromDate, defaultToDate),
    ]);

    setVedicResult(nextResult);
    setNumberRelationships(nextNumberRelationships);
    setPratyantarDasha(nextPratyantarDasha);
    setDashaRows(nextDashaRows);
    setActiveResultType("vedic-grid");
    return result?.message || "Vedic grid generated successfully.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const commonError = validateCommonFields();
    if (commonError) {
      showValidationError(commonError);
      return;
    }

    const yearError = validateYearRange();
    if (calculationType === "lo-shu-grid" && yearError) {
      showValidationError(yearError);
      return;
    }

    const fromYearNumber = Number(fromYear);
    const toYearNumber = Number(toYear);

    try {
      setIsSubmitting(true);
      setMessage("");
      resetResults();
      const normalizedDob = formatDobForApi(dob.trim());
      let nextMessage = "";

      if (calculationType === "lo-shu-grid") {
        nextMessage = await generateLoShuGrid(
          normalizedDob,
          fromYearNumber,
          toYearNumber,
        );
      } else if (calculationType === "vedic-grid") {
        nextMessage = await generateVedicGrid(normalizedDob);
      } else {
        nextMessage = await generateGenericNumerology(normalizedDob);
      }

      setMessage(nextMessage);
      toast.success(nextMessage);
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
    const commonError = validateCommonFields();
    if (commonError) {
      showValidationError(commonError);
      return;
    }

    const yearError = validateYearRange();
    if (yearError) {
      showValidationError(yearError);
      return;
    }

    const fromYearNumber = Number(fromYear);
    const toYearNumber = Number(toYear);

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
        },
      );

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
          <LushuForm
            fullName={fullName}
            setFullName={setFullName}
            gender={gender}
            setGender={setGender}
            dob={dob}
            setDob={setDob}
            calculationType={calculationType}
            setCalculationType={setCalculationType}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            message={message}
          />

          {activeResultType === "lo-shu-grid" && losuResult && personalYearResult && (
            <LushuGridPage
              losuResult={losuResult}
              personalYearResult={personalYearResult}
              personalYearMatrix={personalYearMatrix}
              setPersonalYearMatrix={setPersonalYearMatrix}
              fromYear={fromYear}
              setFromYear={setFromYear}
              toYear={toYear}
              setToYear={setToYear}
              personalityDestinyDetails={personalityDestinyDetails}
              numberRelationships={numberRelationships}
              sectorWiseEffects={sectorWiseEffects}
              loShuRepetitionEffects={loShuRepetitionEffects}
              activePersonalityDestinyTab={activePersonalityDestinyTab}
              setActivePersonalityDestinyTab={setActivePersonalityDestinyTab}
              activeSectorEffectTab={activeSectorEffectTab}
              setActiveSectorEffectTab={setActiveSectorEffectTab}
              personalYearMatrixApi={personalYearMatrixApi}
              isSubmitting={isSubmitting}
            />
          )}

          {activeResultType === "vedic-grid" && vedicResult && (
            <VedicGridPage
              vedicResult={vedicResult}
              numberRelationships={numberRelationships}
              pratyantarDasha={pratyantarDasha}
              setPratyantarDasha={setPratyantarDasha}
              fetchPratyantarDasha={fetchPratyantarDasha}
              dashaRows={dashaRows}
            />
          )}

          {activeResultType &&
            activeResultType !== "lo-shu-grid" &&
            activeResultType !== "vedic-grid" &&
            genericResult && (
              <GenericNumerologyResult
                calculationType={activeResultType}
                result={genericResult}
              />
            )}
        </section>
      </div>
    </PageLayout>
  );
}

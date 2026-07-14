"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageLayout from "@/components/PageLayout";
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

export default function NumerologyPage() {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [fromYear, setFromYear] = useState(String(currentYear));
  const [toYear, setToYear] = useState(String(currentYear + 10));
  const [calculationType, setCalculationType] = useState("lo-shu-grid");
  const [activeResultType, setActiveResultType] = useState("");
  const [losuResult, setLosuResult] = useState(null);
  const [vedicResult, setVedicResult] = useState(null);
  const [personalYearResult, setPersonalYearResult] = useState(null);
  const [personalYearMatrix, setPersonalYearMatrix] = useState([]);
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

    setVedicResult(nextResult);
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
            <VedicGridPage vedicResult={vedicResult} />
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

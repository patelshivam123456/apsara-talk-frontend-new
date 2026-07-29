"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import MatchingOptions from "@/components/KundaliMatching/MatchingOptions";
import PersonBirthDetailsForm from "@/components/KundaliMatching/PersonBirthDetailsForm";
import ResultTabs from "@/components/KundaliMatching/ResultTabs";
import { generateKundaliMatching } from "@/services/kundaliMatching.service";

const initialPerson = {
  firstName: "",
  lastName: "",
  fullName: "",
  gender: "",
  day: "",
  month: "",
  year: "",
  hour: "",
  min: "",
  sec: "",
  place: "",
  lat: "",
  lon: "",
};

const initialOptions = {
  ashtakoot: "false",
  dashakoot: "false",
  papasamyam: "false",
};

const chartStyles = [
  "NORTH_INDIAN",
  "SOUTH_INDIAN",
  "EAST_INDIAN",
  "WEST_INDIAN",
];

function isIntegerInRange(value, min, max) {
  if (!/^\d+$/.test(String(value))) {
    return false;
  }

  const number = Number(value);
  return number >= min && number <= max;
}

function isRealDate(person) {
  const date = new Date(
    Number(person.year),
    Number(person.month) - 1,
    Number(person.day),
  );

  return (
    date.getFullYear() === Number(person.year) &&
    date.getMonth() === Number(person.month) - 1 &&
    date.getDate() === Number(person.day)
  );
}

function validatePerson(person, selectedPlace) {
  const errors = {};

  if (!person.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!person.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!person.gender) {
    errors.gender = "Gender is required.";
  }

  if (!isIntegerInRange(person.day, 1, 31)) {
    errors.day = "Enter a valid day.";
  }

  if (!isIntegerInRange(person.month, 1, 12)) {
    errors.month = "Enter a valid month.";
  }

  if (!isIntegerInRange(person.year, 1900, new Date().getFullYear())) {
    errors.year = "Enter a valid year.";
  }

  if (!errors.day && !errors.month && !errors.year && !isRealDate(person)) {
    errors.day = "Enter a real calendar date.";
  }

  if (!isIntegerInRange(person.hour, 0, 23)) {
    errors.hour = "Hour must be 0 to 23.";
  }

  if (!isIntegerInRange(person.min, 0, 59)) {
    errors.min = "Minute must be 0 to 59.";
  }

  if (!isIntegerInRange(person.sec, 0, 59)) {
    errors.sec = "Second must be 0 to 59.";
  }

  if (
    !selectedPlace ||
    person.place !== selectedPlace.placeName ||
    !selectedPlace.latitude ||
    !selectedPlace.longitude
  ) {
    errors.place = "Please select a birth place from the suggestions.";
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some((value) => {
    if (!value) {
      return false;
    }

    if (typeof value === "object") {
      return hasErrors(value);
    }

    return true;
  });
}

function toPayloadPerson(person, selectedPlace) {
  return {
    firstName: person.firstName.trim(),
    lastName: person.lastName.trim(),
    fullName: person.fullName.trim(),
    day: person.day,
    month: person.month,
    year: person.year,
    hour: person.hour,
    min: person.min,
    sec: person.sec,
    lat: selectedPlace.latitude,
    lon: selectedPlace.longitude,
    gender: person.gender,
    place: selectedPlace.placeName,
  };
}

export default function KundaliMatchingForm({ theme = "public" }) {
  const [person1, setPerson1] = useState(initialPerson);
  const [person2, setPerson2] = useState(initialPerson);
  const [person1Place, setPerson1Place] = useState(null);
  const [person2Place, setPerson2Place] = useState(null);
  const [options, setOptions] = useState(initialOptions);
  const [chartStyle, setChartStyle] = useState("NORTH_INDIAN");
  const [errors, setErrors] = useState({ p1: {}, p2: {}, chartStyle: "" });
  const [result, setResult] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAstrologer = theme === "astrologer";
  const inputClass = isAstrologer
    ? "border-[#d8a84a]/45 bg-white text-[#211704] focus:border-[#b8860b] focus:ring-[#d8a84a]/25"
    : "border-[#eadcae] bg-white text-[#211704] focus:border-[#dfff00] focus:ring-[#dfff00]/35";
  const buttonClass = isAstrologer
    ? "bg-[#c49a00] text-[#211704] hover:bg-[#b8860b]"
    : "bg-[#dfff00] text-[#312d1e] hover:bg-[#cdf000]";

  const hasResult = useMemo(() => !!result, [result]);

  const updatePerson = (key, nextPerson) => {
    if (key === "p1") {
      setPerson1(nextPerson);
      setErrors((current) => ({ ...current, p1: { ...current.p1, form: "" } }));
    } else {
      setPerson2(nextPerson);
      setErrors((current) => ({ ...current, p2: { ...current.p2, form: "" } }));
    }
  };

  const updatePlaceInput = (key, place) => {
    const updater = key === "p1" ? setPerson1 : setPerson2;
    const placeSetter = key === "p1" ? setPerson1Place : setPerson2Place;

    placeSetter(null);
    updater((current) => ({
      ...current,
      place,
      lat: "",
      lon: "",
    }));
    setErrors((current) => ({
      ...current,
      [key]: { ...current[key], place: "" },
    }));
  };

  const selectPlace = (key, place) => {
    const updater = key === "p1" ? setPerson1 : setPerson2;
    const placeSetter = key === "p1" ? setPerson1Place : setPerson2Place;

    placeSetter(place);
    updater((current) => ({
      ...current,
      place: place.placeName,
      lat: place.latitude,
      lon: place.longitude,
    }));
    setErrors((current) => ({
      ...current,
      [key]: { ...current[key], place: "" },
    }));
  };

  const buildPayload = () => ({
    p1: toPayloadPerson(person1, person1Place),
    p2: toPayloadPerson(person2, person2Place),
    options: {
      ashtakoot: options.ashtakoot,
      dashakoot: options.dashakoot,
      papasamyam: options.papasamyam,
    },
    branding: {
      chartStyle,
    },
  });

  const validateForm = () => {
    const nextErrors = {
      p1: validatePerson(person1, person1Place),
      p2: validatePerson(person2, person2Place),
      chartStyle: chartStyles.includes(chartStyle)
        ? ""
        : "Chart style is required.",
    };

    setErrors(nextErrors);
    return nextErrors;
  };

  const submitPayload = async (payload) => {
    try {
      setIsGenerating(true);
      setErrorMessage("");
      const response = await generateKundaliMatching(payload);
      setResult(response);
      setLastPayload(payload);
      toast.success("Kundali Matching report generated successfully.");
    } catch (error) {
      const message =
        error?.message ||
        "Unable to generate Kundali Matching report. Please check the details and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isGenerating) {
      return;
    }

    const nextErrors = validateForm();

    if (hasErrors(nextErrors)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    await submitPayload(buildPayload());
  };

  const retry = () => {
    if (lastPayload && !isGenerating) {
      submitPayload(lastPayload);
    }
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className={`rounded-2xl border p-4 shadow-lg sm:p-5 lg:p-6 ${
          isAstrologer
            ? "border-[#d8a84a]/45 bg-[#fff8ee] text-[#211704]"
            : "border-[#eadcae] bg-white/94 text-[#211704]"
        }`}
      >
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold">Kundali Matching</h2>
          <p className="mt-2 text-sm leading-6 text-[#665d4d]">
            Enter birth details for both persons to generate a detailed Kundali
            matching report.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <PersonBirthDetailsForm
            personKey="p1"
            title="Person 1 Details"
            values={person1}
            selectedPlace={person1Place}
            errors={errors.p1 || {}}
            theme={theme}
            inputClass={inputClass}
            onChange={(nextPerson) => updatePerson("p1", nextPerson)}
            onPlaceInput={(place) => updatePlaceInput("p1", place)}
            onPlaceSelect={(place) => selectPlace("p1", place)}
          />
          <PersonBirthDetailsForm
            personKey="p2"
            title="Person 2 Details"
            values={person2}
            selectedPlace={person2Place}
            errors={errors.p2 || {}}
            theme={theme}
            inputClass={inputClass}
            onChange={(nextPerson) => updatePerson("p2", nextPerson)}
            onPlaceInput={(place) => updatePlaceInput("p2", place)}
            onPlaceSelect={(place) => selectPlace("p2", place)}
          />
        </div>

        <div className="mt-4">
          <MatchingOptions
            chartStyle={chartStyle}
            options={options}
            errors={errors}
            inputClass={inputClass}
            onChartStyleChange={setChartStyle}
            onOptionsChange={setOptions}
          />
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">{errorMessage}</p>
            {lastPayload && (
              <button
                type="button"
                onClick={retry}
                disabled={isGenerating}
                className="mt-3 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#6f5930]">
            Latitude and longitude are stored from selected suggestions only.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className={`inline-flex h-12 min-w-60 items-center justify-center rounded-xl px-5 text-sm font-extrabold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass}`}
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-[#211704]/20 border-t-[#211704] motion-safe:animate-spin" />
                Generating Match...
              </span>
            ) : (
              "Generate Kundali Matching"
            )}
          </button>
        </div>
      </form>

      {hasResult && (
        <ResultTabs
          result={result}
          person1Name={person1.fullName}
          person2Name={person2.fullName}
          theme={theme}
        />
      )}
    </div>
  );
}

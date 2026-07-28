"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import PlaceAutocomplete from "@/components/Kundali/PlaceAutocomplete";
import ResultTabs from "@/components/Kundali/ResultTabs";
import { generateKundali } from "@/services/kundali.service";

const genderOptions = [
  ["", "Select gender"],
  ["male", "Male"],
  ["female", "Female"],
  ["others", "Others"],
];

const chartStyles = [
  "NORTH_INDIAN",
  "SOUTH_INDIAN",
  "EAST_INDIAN",
  "WEST_INDIAN",
];

const initialValues = {
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
  chartStyle: "NORTH_INDIAN",
};

function isIntegerInRange(value, min, max) {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  const number = Number(value);
  return number >= min && number <= max;
}

function validate(values, selectedPlace) {
  const nextErrors = {};

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Full name is required.";
  }

  if (!values.gender) {
    nextErrors.gender = "Gender is required.";
  }

  if (!isIntegerInRange(values.day, 1, 31)) {
    nextErrors.day = "Enter a valid day.";
  }

  if (!isIntegerInRange(values.month, 1, 12)) {
    nextErrors.month = "Enter a valid month.";
  }

  if (!isIntegerInRange(values.year, 1900, new Date().getFullYear())) {
    nextErrors.year = "Enter a valid year.";
  }

  if (!isIntegerInRange(values.hour, 0, 23)) {
    nextErrors.hour = "Hour must be 0 to 23.";
  }

  if (!isIntegerInRange(values.min, 0, 59)) {
    nextErrors.min = "Minute must be 0 to 59.";
  }

  if (!isIntegerInRange(values.sec, 0, 59)) {
    nextErrors.sec = "Second must be 0 to 59.";
  }

  if (!selectedPlace || values.place !== selectedPlace.placeName) {
    nextErrors.place = "Select a birth place from the suggestions.";
  }

  if (!values.chartStyle) {
    nextErrors.chartStyle = "Chart style is required.";
  }

  if (!nextErrors.day && !nextErrors.month && !nextErrors.year) {
    const date = new Date(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
    );
    const validDate =
      date.getFullYear() === Number(values.year) &&
      date.getMonth() === Number(values.month) - 1 &&
      date.getDate() === Number(values.day);

    if (!validDate) {
      nextErrors.day = "Enter a real calendar date.";
    }
  }

  return nextErrors;
}

function FieldError({ message }) {
  return <div className="mt-1.5 min-h-5 text-xs font-semibold text-red-600">{message}</div>;
}

export default function KundaliForm({ theme = "public" }) {
  const [values, setValues] = useState(initialValues);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const isAstrologer = theme === "astrologer";
  const inputClass = isAstrologer
    ? "border-[#d8a84a]/45 bg-white text-[#211704] focus:border-[#b8860b] focus:ring-[#d8a84a]/25"
    : "border-[#eadcae] bg-white text-[#211704] focus:border-[#dfff00] focus:ring-[#dfff00]/35";
  const buttonClass = isAstrologer
    ? "bg-[#c49a00] text-[#211704] hover:bg-[#b8860b]"
    : "bg-[#dfff00] text-[#312d1e] hover:bg-[#cdf000]";

  const hasResult = useMemo(() => !!result, [result]);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handlePlaceInput = (place) => {
    setSelectedPlace(null);
    setValues((current) => ({
      ...current,
      place,
      lat: "",
      lon: "",
    }));
    setErrors((current) => ({ ...current, place: "" }));
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setValues((current) => ({
      ...current,
      place: place.placeName,
      lat: place.latitude,
      lon: place.longitude,
    }));
    setErrors((current) => ({ ...current, place: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values, selectedPlace);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      birth: {
        fullName: values.fullName.trim(),
        day: values.day,
        month: values.month,
        year: values.year,
        hour: values.hour,
        min: values.min,
        sec: values.sec,
        gender: values.gender,
        place: selectedPlace.placeName,
        lat: selectedPlace.latitude,
        lon: selectedPlace.longitude,
      },
      branding: {
        chartStyle: values.chartStyle,
      },
    };

    try {
      setIsGenerating(true);
      const response = await generateKundali(payload);
      setResult(response);
      toast.success("Kundali PDF generated successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to generate Kundali PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderInput = (field, label, props = {}) => (
    <div>
      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]">
        {label}
      </label>
      <input
        value={values[field]}
        onChange={(event) => updateField(field, event.target.value)}
        className={`mt-2 h-12 w-full rounded-xl border px-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
        {...props}
      />
      <FieldError message={errors[field]} />
    </div>
  );

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
          <h2 className="text-2xl font-extrabold">Generate Kundali PDF</h2>
          <p className="mt-2 text-sm leading-6 text-[#665d4d]">
            Enter birth details to generate Kundali PDF.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {renderInput("fullName", "Full Name", {
            placeholder: "Enter full name",
            autoComplete: "name",
          })}

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]">
              Gender
            </label>
            <select
              value={values.gender}
              onChange={(event) => updateField("gender", event.target.value)}
              className={`mt-2 h-12 w-full rounded-xl border px-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
            >
              {genderOptions.map(([value, label]) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError message={errors.gender} />
          </div>
        </div>

        <div className="mt-0 grid gap-4 md:grid-cols-3">
          {renderInput("day", "Day", {
            inputMode: "numeric",
            placeholder: "DD",
            maxLength: 2,
          })}
          {renderInput("month", "Month", {
            inputMode: "numeric",
            placeholder: "MM",
            maxLength: 2,
          })}
          {renderInput("year", "Year", {
            inputMode: "numeric",
            placeholder: "YYYY",
            maxLength: 4,
          })}
        </div>

        <div className="mt-0 grid gap-4 md:grid-cols-3">
          {renderInput("hour", "Hour", {
            inputMode: "numeric",
            placeholder: "HH",
            maxLength: 2,
          })}
          {renderInput("min", "Minute", {
            inputMode: "numeric",
            placeholder: "MM",
            maxLength: 2,
          })}
          {renderInput("sec", "Second", {
            inputMode: "numeric",
            placeholder: "SS",
            maxLength: 2,
          })}
        </div>

        <div className="mt-0 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <PlaceAutocomplete
            value={values.place}
            selectedPlace={selectedPlace}
            onInputChange={handlePlaceInput}
            onSelectPlace={handlePlaceSelect}
            error={errors.place}
            theme={theme}
          />

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]">
              Chart Style
            </label>
            <select
              value={values.chartStyle}
              onChange={(event) => updateField("chartStyle", event.target.value)}
              className={`mt-2 h-12 w-full rounded-xl border px-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
            >
              {chartStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <FieldError message={errors.chartStyle} />
          </div>
        </div>

        <input type="hidden" value={values.lat} readOnly />
        <input type="hidden" value={values.lon} readOnly />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#6f5930]">
            Latitude and longitude are locked from the selected place.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className={`inline-flex h-12 min-w-48 items-center justify-center rounded-xl px-5 text-sm font-extrabold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass}`}
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-[#211704]/20 border-t-[#211704] motion-safe:animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate Kundali"
            )}
          </button>
        </div>
      </form>

      {hasResult && <ResultTabs result={result} theme={theme} />}
    </div>
  );
}

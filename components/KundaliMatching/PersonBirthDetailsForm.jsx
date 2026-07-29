"use client";

import PlaceAutocomplete from "@/components/Kundali/PlaceAutocomplete";

const genderOptions = [
  ["", "Select gender"],
  ["male", "Male"],
  ["female", "Female"],
  ["others", "Others"],
];

function FieldError({ message }) {
  return (
    <div className="mt-1.5 min-h-5 text-xs font-semibold text-red-600">
      {message}
    </div>
  );
}

export default function PersonBirthDetailsForm({
  personKey,
  title,
  values,
  selectedPlace,
  errors,
  theme,
  inputClass,
  onChange,
  onPlaceInput,
  onPlaceSelect,
}) {
  const updateName = (field, value) => {
    const previousComposed = [values.firstName, values.lastName]
      .filter(Boolean)
      .join(" ");
    const nextValues = { ...values, [field]: value };

    if (
      (field === "firstName" || field === "lastName") &&
      (!values.fullName.trim() || values.fullName === previousComposed)
    ) {
      nextValues.fullName = [nextValues.firstName, nextValues.lastName]
        .filter(Boolean)
        .join(" ");
    }

    onChange(nextValues);
  };

  const renderInput = (field, label, props = {}) => (
    <div>
      <label
        htmlFor={`${personKey}-${field}`}
        className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]"
      >
        {label}
      </label>
      <input
        id={`${personKey}-${field}`}
        value={values[field]}
        onChange={(event) =>
          field === "firstName" || field === "lastName"
            ? updateName(field, event.target.value)
            : onChange({ ...values, [field]: event.target.value })
        }
        className={`mt-2 h-12 w-full rounded-xl border px-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
        {...props}
      />
      <FieldError message={errors[field]} />
    </div>
  );

  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
          {title}
        </p>
        <h3 className="mt-1 text-lg font-extrabold text-[#211704]">
          Birth Details
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {renderInput("firstName", "First Name", {
          placeholder: "First name",
          autoComplete: "given-name",
        })}
        {renderInput("lastName", "Last Name", {
          placeholder: "Last name",
          autoComplete: "family-name",
        })}
      </div>

      <div className="mt-0 grid gap-4 md:grid-cols-2">
        {renderInput("fullName", "Full Name", {
          placeholder: "Full name",
          autoComplete: "name",
        })}

        <div>
          <label
            htmlFor={`${personKey}-gender`}
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]"
          >
            Gender
          </label>
          <select
            id={`${personKey}-gender`}
            value={values.gender}
            onChange={(event) =>
              onChange({ ...values, gender: event.target.value })
            }
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

      <div className="mt-0">
        <PlaceAutocomplete
          id={`${personKey}-place`}
          label="Birth Place"
          value={values.place}
          selectedPlace={selectedPlace}
          onInputChange={onPlaceInput}
          onSelectPlace={onPlaceSelect}
          error={errors.place}
          theme={theme}
        />
      </div>

      <input type="hidden" value={values.lat} readOnly />
      <input type="hidden" value={values.lon} readOnly />
    </section>
  );
}

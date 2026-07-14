import { calculationOptions } from "./constants";

export default function LushuForm({
  fullName,
  setFullName,
  gender,
  setGender,
  dob,
  setDob,
  calculationType,
  setCalculationType,
  handleSubmit,
  isSubmitting,
  message,
}) {
  return (
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
  );
}

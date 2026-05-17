export default function CircularProgress({ value = 72 }) {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (value / 100) * circumference;

  return (
    <div className="relative w-[90px] h-[90px]">
      <svg height="90" width="90">
        {/* Background circle */}
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="45"
          cy="45"
        />

        {/* Progress circle */}
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx="45"
          cy="45"
        />

        {/* Gradient */}
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
        {value}%
      </div>
    </div>
  );
}
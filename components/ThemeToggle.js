import { useTheme } from "@/context/ThemeContext";

const themes = [
  { id: "default",   label: "Default",   color: "#0f1535" },
  { id: "yellow",    label: "Yellow",    color: "#fde047" },
  { id: "red",       label: "Red",       color: "#fca5a5" },
  { id: "blue",      label: "Blue",      color: "#93c5fd" },
  { id: "cream",     label: "Cream",     color: "#c9a227" },
  { id: "dark-gold", label: "Dark Gold", color: "#c47a0a" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5">
      {themes.map((t) => (
        <button
          key={t.id}
          title={t.label}
          onClick={() => setTheme(t.id)}
          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
            theme === t.id
              ? "scale-125 border-white/80"
              : "border-white/20 hover:border-white/50 hover:scale-110"
          }`}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  );
}

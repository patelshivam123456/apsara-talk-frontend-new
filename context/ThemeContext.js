import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

const getAutoTheme = () => {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 5 ? "dark-gold" : "cream";
};

const getResolvedTheme = (mode) => {
  if (mode === "night") return "dark-gold";
  if (mode === "day") return "cream";
  if (mode === "auto") return getAutoTheme();
  return mode || "cream";
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("day");
  const [, setAutoTick] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setThemeMode(window.localStorage.getItem("theme-mode") || "auto");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (themeMode !== "auto") return undefined;

    const interval = window.setInterval(() => {
      setAutoTick((tick) => tick + 1);
    }, 60 * 1000);

    return () => window.clearInterval(interval);
  }, [themeMode]);

  const theme = getResolvedTheme(themeMode);

  const handleSetTheme = (t) => {
    const nextMode = t === "cream" ? "day" : t === "dark-gold" ? "night" : t;
    setThemeMode(nextMode);
    window.localStorage.setItem("theme-mode", nextMode);
  };

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      effectiveTheme: theme,
      setTheme: handleSetTheme,
    }),
    [theme, themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} className="theme-root">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

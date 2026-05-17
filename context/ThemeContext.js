import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("cream");

  // Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem("appTheme");
    if (saved) setTheme(saved);
  }, []);

  // Persist theme whenever it changes
  const handleSetTheme = (t) => {
    setTheme(t);
    localStorage.setItem("appTheme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <div data-theme={theme} className="theme-root">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

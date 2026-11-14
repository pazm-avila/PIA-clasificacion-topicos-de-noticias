import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [oscuro, setOscuro] = useState(() => localStorage.getItem("tema") !== "claro");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", oscuro);
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
  }, [oscuro]);

  return (
    <ThemeContext.Provider value={{ oscuro, alternar: () => setOscuro((o) => !o) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
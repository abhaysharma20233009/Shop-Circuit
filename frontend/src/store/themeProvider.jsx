import { createContext, useContext, useEffect, useState } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export function ThemeProvider({ children }) {
  // Load theme from localStorage (default: dark)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    // Apply theme to <html> tag
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Store theme preference
  }, [theme]);

  // Toggle between dark and light theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook for Theme
export function useTheme() {
  return useContext(ThemeContext);
}

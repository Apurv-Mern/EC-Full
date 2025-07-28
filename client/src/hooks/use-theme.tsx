import { useEffect, useState } from "react";

// Possible theme values
type Theme = "light" | "dark";

export function useTheme(): [Theme, (theme: Theme) => void, () => void] {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    // Default to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => setThemeState(t => (t === "dark" ? "light" : "dark"));

  return [theme, setThemeState, toggleTheme];
} 
import { useState, useEffect, useCallback } from "react";

interface ThemeConfig {
  appearance: string;
  densityTheme: string;
  accentColor: string;
  [key: string]: string;
}

interface ThemeJson {
  name: string;
  type: string;
  config: ThemeConfig;
  shadcn: {
    darkMode: boolean;
    theme: string;
    density: string;
  };
  timestamp: string;
}

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeJson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme to DOM
  const applyTheme = useCallback((themeJson: ThemeJson) => {
    const root = document.documentElement;

    // Apply shadcn/ui dark mode class
    if (themeJson.config.appearance === "Dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply data attributes for CSS variables
    root.setAttribute(
      "data-accent-color",
      themeJson.config.accentColor?.toLowerCase() || "green"
    );
    root.setAttribute(
      "data-density",
      themeJson.config.densityTheme?.toLowerCase() || "standard"
    );
    root.setAttribute(
      "data-appearance",
      themeJson.config.appearance?.toLowerCase() || "light"
    );

    // Save to localStorage
    localStorage.setItem("app-theme", JSON.stringify(themeJson));
    setCurrentTheme(themeJson);
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      try {
        const themeJson = JSON.parse(savedTheme);
        applyTheme(themeJson);
      } catch (error) {
        console.error("Failed to load saved theme:", error);
      }
    }
    setIsLoading(false);
  }, [applyTheme]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    const defaultTheme: ThemeJson = {
      name: "default-theme",
      type: "default",
      config: {
        appearance: "Light",
        densityTheme: "Standard",
        accentColor: "Green",
      },
      shadcn: {
        darkMode: false,
        theme: "green",
        density: "standard",
      },
      timestamp: new Date().toISOString(),
    };
    applyTheme(defaultTheme);
  }, [applyTheme]);

  // Get current theme config
  const getThemeConfig = useCallback((): ThemeConfig | null => {
    return currentTheme?.config || null;
  }, [currentTheme]);

  return {
    currentTheme,
    applyTheme,
    resetTheme,
    getThemeConfig,
    isLoading,
  };
};
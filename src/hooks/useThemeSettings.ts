import { useState, useCallback } from "react";

interface SettingItem {
  label: string;
  value: string;
  options: string[];
}

interface Settings {
  [key: string]: SettingItem;
}

export const useThemeSettings = (initialSettings: Settings) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const updateSetting = useCallback((key: string, value: string) => {
    setSettings((prev: Settings) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  }, []);

  const resetSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, []);

  const getSettingsConfig = useCallback(() => {
    return Object.keys(settings).reduce((acc: any, key) => {
      acc[key] = settings[key].value;
      return acc;
    }, {});
  }, [settings]);

  return {
    settings,
    updateSetting,
    resetSettings,
    getSettingsConfig,
  };
};
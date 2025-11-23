import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import styles from "./PersonalizeView.module.scss";

const data = {
  tabs: [
    {
      key: "default",
      label: "Default",
      fields: [
        {
          id: "appearance",
          label: "Appearance",
          type: "select",
          value: "Light",
          options: ["Light", "Dark", "System"],
        },
        {
          id: "densityTheme",
          label: "Density Theme",
          type: "select",
          value: "Standard",
          options: ["Compact", "Standard", "Comfortable"],
        },
        {
          id: "accent",
          label: "Accent",
          type: "select",
          value: "Professional",
          options: ["Professional", "Cool"],
        },
        {
          id: "accentColor",
          label: "Accent Color",
          type: "select",
          value: "Green",
          options: ["Green", "Blue", "Red", "Purple"],
        },
      ],
    },
    {
      key: "accessible",
      label: "Accessible",
      fields: [
        {
          id: "appearance",
          label: "Appearance",
          type: "select",
          value: "Light",
          options: ["Light", "Dark", "System"],
        },
        {
          id: "densityTheme",
          label: "Density Theme",
          type: "select",
          value: "Standard",
          options: ["Compact", "Standard", "Comfortable"],
        },
        {
          id: "typus",
          label: "Typus",
          type: "select",
          value: "Dekorampus",
          options: ["Dekorampus", "Classic", "Readable"],
        },
      ],
    },
  ],
  actions: [
    {
      type: "button",
      label: "Cancel",
      variant: "secondary",
    },
    {
      type: "button",
      label: "Apply",
      variant: "blue",
    },
  ],
};

type SettingItem = {
  label: string;
  value: string;
  options: string[];
};

type Settings = {
  [key: string]: SettingItem;
};

const PersonalizeView = () => {
  const [activeTab, setActiveTab] = useState<string>(data.tabs[0].key);
  const { applyTheme } = useTheme();
  const { settings, updateSetting, resetSettings, getSettingsConfig } =
    useThemeSettings(
      data.tabs[0].fields.reduce((acc: Settings, field: any) => {
        acc[field.id] = {
          label: field.label,
          value: field.value,
          options: field.options,
        };
        return acc;
      }, {})
    );

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    const selectedTab = data.tabs.find((tab) => tab.key === tabKey);
    if (selectedTab) {
      const newSettings = selectedTab.fields.reduce(
        (acc: Settings, field: any) => {
          acc[field.id] = {
            label: field.label,
            value: field.value,
            options: field.options,
          };
          return acc;
        },
        {}
      );
      resetSettings(newSettings);
    }
  };

  const handleChange = (key: string, value: string) => {
    updateSetting(key, value);
  };

  const handleApply = () => {
    const themeConfig = getSettingsConfig();

    const themeJson = {
      name: `${activeTab}-theme`,
      type: activeTab,
      config: themeConfig,
      shadcn: {
        darkMode: themeConfig.appearance === "Dark",
        theme: themeConfig.accentColor?.toLowerCase() || "green",
        density: themeConfig.densityTheme?.toLowerCase() || "standard",
      },
      timestamp: new Date().toISOString(),
    };

    applyTheme(themeJson);
    console.log("Theme Applied:", themeJson);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Personalize View</h2>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabsContainer}>
          {data.tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`${styles.tabButton} ${
                activeTab === tab.key ? styles.active : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {Object.keys(settings).map((key) => {
          const item = settings[key];
          return (
            <div key={key} className={styles.settingGroup}>
              <label className={styles.label}>{item.label}</label>
              <select
                className={styles.select}
                value={item.value}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                {item.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.secondary}`}>
          Cancel
        </button>
        <button
          onClick={handleApply}
          className={`${styles.button} ${styles.primary}`}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PersonalizeView;

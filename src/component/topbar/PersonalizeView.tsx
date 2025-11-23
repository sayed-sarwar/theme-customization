import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useThemeSettings } from "@/hooks/useThemeSettings.ts";

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
    <div className="w-[380px] bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-xl font-semibold text-card-foreground">
          Personalize view
        </h2>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {data.tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {Object.keys(settings).map((key) => {
          const item = settings[key];

          return (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {item.label}
              </label>

              <select
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors duration-200"
                value={item.value}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                {item.options.map((opt: any) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-sm font-medium text-primary-foreground rounded-lg bg-primary hover:bg-primary/90 transition-colors duration-200"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PersonalizeView;

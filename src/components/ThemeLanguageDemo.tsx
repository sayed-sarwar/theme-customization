import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../hooks/useTheme";
import { LanguageSelector } from "./LanguageSelector";
import styles from "./ThemeLanguageDemo.module.scss";

export function ThemeLanguageDemo() {
  return (
    <div className={`${styles.rtlAware} rtl-aware`}>
      <LanguageSelector />
    </div>
  );
}

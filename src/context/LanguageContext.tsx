import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('app-language') || 'en';
    } catch {
      return 'en';
    }
  });
  const [translations, setTranslations] = useState<Record<string, any>>({});

  const isRTL = RTL_LANGUAGES.includes(language);

  useEffect(() => {
    loadTranslations(language);
    applyLanguageTheme(language, isRTL);
  }, [language, isRTL]);

  const loadTranslations = async (lang: string) => {
    try {
      const module = await import(`../locales/${lang}.json`);
      setTranslations(module.default || module);
    } catch (error) {
      console.warn(`Failed to load translations for ${lang}, falling back to en`);
      try {
        const fallback = await import('../locales/en.json');
        setTranslations(fallback.default || fallback);
      } catch {
        setTranslations({});
      }
    }
  };

  const applyLanguageTheme = (lang: string, rtl: boolean) => {
    const root = document.documentElement;
    
    // Apply language-specific attributes
    root.setAttribute('lang', lang);
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    root.setAttribute('data-language', lang);
    root.setAttribute('data-rtl', rtl.toString());
    
    // Save to localStorage
    try {
      localStorage.setItem('app-language', lang);
    } catch {
      // Handle localStorage access errors (e.g., private browsing)
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
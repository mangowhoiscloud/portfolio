"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ko" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ko: string, en: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");

  const t = (ko: string, en: string) => (language === "ko" ? ko : en);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

// Bilingual text component
export function T({ ko, en }: { ko: string; en: string }) {
  const { t } = useI18n();
  return <>{t(ko, en)}</>;
}

// Language toggle button component
export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <button
      onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
      className="px-3 py-1.5 text-sm font-medium rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
    >
      {language === "ko" ? "EN" : "한"}
    </button>
  );
}

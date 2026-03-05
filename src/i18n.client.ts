"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let LanguageDetector: any = null;
if (typeof window !== "undefined") {
  LanguageDetector = require("i18next-browser-languagedetector").default;
}

import en from "./locales/en/common.json";
import fr from "./locales/fr/common.json";
import ar from "./locales/ar/common.json";

let initialLng = "en";
if (typeof document !== "undefined") {
  const m = document.cookie.match(/(?:^|;\s*)i18next=([^;]+)/);
  if (m) initialLng = decodeURIComponent(m[1]);
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector || { type: "languageDetector", init() {}, detect: () => initialLng, cacheUserLanguage() {} })
    .init({
      resources: { en: { common: en }, fr: { common: fr }, ar: { common: ar } },
      lng: initialLng,               
      fallbackLng: "en",
      supportedLngs: ["en", "fr", "ar"],
      ns: ["common"], defaultNS: "common",
      interpolation: { escapeValue: false },
      detection: { order: ["cookie", "localStorage", "navigator"], caches: ["cookie"] },
    });
}

export default i18n;

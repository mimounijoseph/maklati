"use client";

import { useEffect, useRef, useState } from "react";
import i18n from "@/i18n.client";

type Lng = "en" | "fr" | "ar";

const LANGS: Array<{ code: Lng; label: string; native: string; flag: JSX.Element }> = [
  {
    code: "en",
    label: "Eng",
    native: "Eng",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="h-4 w-6 rounded-sm" aria-hidden="true" focusable="false" role="img">
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path stroke="#fff" strokeWidth="60" d="M0 0l640 480M640 0L0 480" />
        <path stroke="#C8102E" strokeWidth="40" d="M0 0l640 480M640 0L0 480" />
        <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
        <path fill="#C8102E" d="M270 0h100v480H270zM0 190h640v100H0z" />
      </svg>
    ),
  },
  {
    code: "fr",
    label: "Fr",
    native: "Fr",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="h-4 w-6 rounded-sm" aria-hidden="true" focusable="false" role="img">
        <rect width="1" height="2" x="0" fill="#002395" />
        <rect width="1" height="2" x="1" fill="#fff" />
        <rect width="1" height="2" x="2" fill="#ED2939" />
      </svg>
    ),
  },
  {
    code: "ar",
    label: "Ar",
    native: "Ar",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="h-4 w-6 rounded-sm" aria-hidden="true" focusable="false" role="img">
        <path fill="#006c35" d="M0 0h640v480H0z" />
        <g fill="#fff">
          <path d="M490 300H150c-11 0-20-9-20-20s9-20 20-20h340c11 0 20 9 20 20s-9 20-20 20z" />
          <rect x="150" y="280" width="340" height="8" />
        </g>
      </svg>
    ),
  },
];

export default function LanguageSelectFancy() {
  const initial = (i18n.language as Lng) || "en";
  const [open, setOpen] = useState(false);
  const [lng, setLng] = useState<Lng>(initial);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  }, [lng]);

  const applyLanguage = async (code: Lng) => {
    setLng(code);
    await i18n.changeLanguage(code);
    document.cookie = `i18next=${code};path=/;SameSite=Lax;max-age=31536000`;
    fetch(`/api/lang/${code}`, { method: "POST" }).catch(() => {});
    setOpen(false);
  };

  const current = LANGS.find((l) => l.code === lng)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center mt-2 gap-2 rounded-xl text-gray-500 border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
      >
        {current.flag}
        <span className="font-medium">{current.native}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"            
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          role="img"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      <div
        className={`absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-2xl border border-gray-200 bg-white/95 p-1.5 shadow-lg backdrop-blur transition-all ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        role="listbox"
        aria-label="Languages"
      >
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => applyLanguage(l.code)}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-100 ${
              lng === l.code ? "bg-gray-100" : ""
            }`}
            role="option"
            aria-selected={lng === l.code}
          >
            {l.flag}
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{l.native}</span>
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
            {lng === l.code && (
              <svg
                xmlns="http://www.w3.org/2000/svg"      
                className="ml-auto h-4 w-4 text-emerald-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 010 1.42l-7.01 7.01a1 1 0 01-1.42 0L3.296 8.744a1 1 0 111.414-1.415l4.004 4.004 6.3-6.3a1 1 0 011.42 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );

}

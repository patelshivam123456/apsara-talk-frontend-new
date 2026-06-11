"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, languages, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <label className="sr-only" htmlFor="global-language-select">
        Select language
      </label>
      <select
        id="global-language-select"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="h-10 max-w-36 rounded-full border border-white/10 bg-[#0f1535] px-3 text-xs text-white shadow-2xl outline-none"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

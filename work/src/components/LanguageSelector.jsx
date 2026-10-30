import { useEffect, useRef, useState } from "react";
import { languages } from "../i18n.js";
import { useLanguage } from "./LanguageProvider.jsx";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const root = useRef(null),
    trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <div
      className="language-selector"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        className="language-trigger"
        type="button"
        aria-label={t("Cambiar idioma")}
        title={t("Cambiar idioma")}
        aria-expanded={open}
        aria-controls="language-options"
        onClick={() => setOpen(!open)}
      >
        <svg
          viewBox="0 0 24 24"
          width="21"
          height="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18M5 6h14M5 18h14" />
        </svg>
        <span>{language.toUpperCase()}</span>
      </button>
      {open && (
        <ul
          className="language-options"
          id="language-options"
          aria-label={t("Idiomas disponibles")}
        >
          {languages.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                lang={item.code}
                aria-pressed={language === item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                <span>{item.name}</span>
                {language === item.code && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

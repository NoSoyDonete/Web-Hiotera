import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MeteoScene from "./components/MeteoScene.jsx";
import {
  LanguageProvider,
  useLanguage,
} from "./components/LanguageProvider.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import "./styles.css";
import "./experience.css";
import "./site-services.css";

function MeteoPreview() {
  const { localize } = useLanguage();
  return localize(
    <>
      <header className="meteo-preview-nav">
        <a href="./#inicio">← Volver a Hiotera</a>
        <LanguageSelector />
      </header>
      <main>
        <MeteoScene />
      </main>
    </>,
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider pageKey="meteo">
      <MeteoPreview />
    </LanguageProvider>
  </StrictMode>,
);

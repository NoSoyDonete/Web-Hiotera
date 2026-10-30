import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./components/LanguageProvider.jsx";
import LegalPage from "./components/LegalPage.jsx";
import { legalDocuments } from "./legalContent.js";
import "./styles.css";
import "./experience.css";
import "./site-services.css";

const requestedKey = new URLSearchParams(window.location.search).get(
  "document",
);
const documentKey = Object.hasOwn(legalDocuments, requestedKey)
  ? requestedKey
  : "aviso-legal";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider pageTitle={legalDocuments[documentKey].title}>
      <LegalPage documentKey={documentKey} />
    </LanguageProvider>
  </StrictMode>,
);

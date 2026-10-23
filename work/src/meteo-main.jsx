import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MeteoScene from "./components/MeteoScene.jsx";
import "./styles.css";
import "./experience.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <header className="meteo-preview-nav">
      <a href="./#inicio">← Volver a Hiotera</a>
      <span>ESTACIÓN METEOROLÓGICA 3D</span>
    </header>
    <main>
      <MeteoScene />
    </main>
  </StrictMode>,
);

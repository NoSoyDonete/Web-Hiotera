import { useState } from "react";
import { useLanguage } from "./LanguageProvider.jsx";
import { assetUrl, site } from "../config.js";
import { heroPhases } from "../content.js";
import { useHeroPhases } from "../hooks/useHeroPhases.js";

export default function HeroScene({ onContact }) {
  const { localize } = useLanguage();
  const { phase, selectPhase, onTabKeyDown } = useHeroPhases();
  const [photoReady, setPhotoReady] = useState(false);

  return localize(
    <section
      className="hero sensor-hero photo-hero"
      id="inicio"
      data-scene-stage={phase}
      aria-label="Presentación de Hiotera"
    >
      <div className="sensor-pin">
        <div className="sensor-radar" aria-hidden="true">
          <i />
        </div>
        <img
          className="sensor-fallback"
          src={assetUrl(site.installationPhoto)}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="sync"
          onLoad={(event) => {
            const image = event.currentTarget;
            image
              .decode()
              .catch(() => undefined)
              .finally(() => {
                window.setTimeout(() => {
                  image.classList.add("photo-ready");
                    setPhotoReady(true);
                    document.documentElement.classList.add("app-ready");
                  }, 650);
              });
          }}
          onError={() => document.documentElement.classList.add("app-ready")}
          style={photoReady ? undefined : { opacity: 0 }}
        />
        <div className="hero-copy">
          <div className="hero-phases">
            {heroPhases.map((item, index) => (
              <div
                className={`hero-phase${phase === index ? " active" : ""}`}
                id={`hero-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${index}`}
                data-phase={index}
                key={item.eyebrow}
                aria-hidden={phase !== index}
                inert={phase !== index}
                tabIndex={phase === index ? 0 : -1}
              >
                <div className="eyebrow">{item.eyebrow}</div>
                <h1>
                  {item.title}
                  <br />
                  <span>{item.highlight}</span>
                </h1>
                <p>{item.description}</p>
                {(item.action || item.contact) && (
                  <div className="hero-actions">
                    {item.action && (
                      <a
                        className="button acid"
                        href={item.action.href}
                        tabIndex={phase === index ? 0 : -1}
                      >
                        {item.action.label} <span className="arrow">↘</span>
                      </a>
                    )}
                    {item.contact && (
                      <button
                        className="button outline"
                        onClick={onContact}
                        tabIndex={phase === index ? 0 : -1}
                      >
                        Cuéntanos qué necesitas
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="hero-tabs"
            role="tablist"
            aria-label="Mensajes de Hiotera"
          >
            {heroPhases.map((item, index) => (
              <button
                type="button"
                role="tab"
                className="hero-tab"
                key={item.tab}
                id={`hero-tab-${index}`}
                data-hero-tab={index}
                aria-controls={`hero-panel-${index}`}
                aria-selected={phase === index}
                tabIndex={phase === index ? 0 : -1}
                onClick={() => selectPhase(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.tab}
              </button>
            ))}
          </div>
        </div>
        <div className="scene-counter">
          <b>{String(phase + 1).padStart(2, "0")}</b>
          <span>/</span>
          {String(heroPhases.length).padStart(2, "0")}
        </div>
      </div>
    </section>,
  );
}

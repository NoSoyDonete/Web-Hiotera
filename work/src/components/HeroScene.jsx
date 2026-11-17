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
        <div className="sensor-radar" aria-hidden="true" />
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
                key={item.tab}
                aria-hidden={phase !== index}
                inert={phase !== index}
                tabIndex={phase === index ? 0 : -1}
              >
                {/* Un solo h1 en la página: los demás mensajes son h2. */}
                {(() => {
                  const Title = index === 0 ? "h1" : "h2";
                  return (
                    <Title className="hero-title">
                      {item.title}
                      <br />
                      <span>{item.highlight}</span>
                    </Title>
                  );
                })()}
                <p>{item.description}</p>
                {(item.action || item.contact) && (
                  <div className="hero-actions">
                    {/* Una acción principal: hablar con un técnico. */}
                    {item.contact && (
                      <button
                        className="button acid"
                        onClick={onContact}
                        tabIndex={phase === index ? 0 : -1}
                      >
                        Hablar con un técnico{" "}
                        <span className="arrow">↗</span>
                      </button>
                    )}
                    {item.action && (
                      <a
                        className={`button ${item.contact ? "outline" : "acid"}`}
                        href={item.action.href}
                        tabIndex={phase === index ? 0 : -1}
                      >
                        {item.action.label} <span className="arrow">↘</span>
                      </a>
                    )}
                  </div>
                )}
                {index === 0 && (
                  <p className="hero-assurance">
                    Lo instala un técnico de Hiotera y te enseña a usarlo el
                    mismo día.
                  </p>
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

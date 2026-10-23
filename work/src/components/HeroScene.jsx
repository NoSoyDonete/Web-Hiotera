import { useRef } from "react";
import { assetUrl, site } from "../config.js";
import { heroPhases } from "../content.js";
import { useHeroPhases } from "../hooks/useHeroPhases.js";

export default function HeroScene({ onContact }) {
  const sectionRef = useRef(null);
  const phase = useHeroPhases(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="hero sensor-hero photo-hero"
      id="inicio"
      data-scene-stage={phase}
      aria-label="Presentación de Hiotera"
    >
      <div className="sensor-pin">
        <div className="hero-hud">
          <span>HIOTERA / CAMPO CONECTADO</span>
          <span>nodo en línea</span>
        </div>
        <div className="sensor-radar" aria-hidden="true">
          <i />
        </div>
        <img
          className="sensor-fallback"
          src={assetUrl(site.installationPhoto)}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className="hero-phases">
          {heroPhases.map((item, index) => (
            <div
              className={`hero-phase${phase === index ? " active" : ""}`}
              data-phase={index}
              key={item.eyebrow}
              aria-hidden={phase !== index}
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
                      Cuéntanos tu finca
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {heroPhases.map((item, index) => (
          <div
            className={`sensor-note note-${["a", "b", "c"][index]}`}
            key={item.note[0]}
            aria-hidden={phase !== index}
          >
            <b>{item.note[0]}</b>
            <span>{item.note[1]}</span>
          </div>
        ))}
        <div className="scroll-cue">
          <i aria-hidden="true" /> Desliza para recorrer
        </div>
        <div className="scene-counter">
          <b>{String(phase + 1).padStart(2, "0")}</b>
          <span>/</span>03
        </div>
      </div>
    </section>
  );
}

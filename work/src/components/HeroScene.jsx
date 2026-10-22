import { useRef } from "react";
import { assetUrl, site, sensorAnimation } from "../config.js";
import { heroPhases } from "../content.js";
import { useSensorScene } from "../hooks/useSensorScene.js";

export default function HeroScene({ onContact }) {
  const sectionRef = useRef(null),
    pinRef = useRef(null),
    modelRef = useRef(null),
    cueRef = useRef(null);
  const { phase, modelReady, modelFailed } = useSensorScene(
    sectionRef,
    pinRef,
    modelRef,
    cueRef,
  );

  return (
    <section
      ref={sectionRef}
      className={`hero sensor-hero${modelReady ? " model-loaded" : ""}${modelFailed ? " model-error" : ""}`}
      id="inicio"
      data-scene-stage={phase}
      aria-label="Presentación interactiva del sensor Hiotera"
    >
      <div ref={pinRef} className="sensor-pin">
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
        />
        <model-viewer
          ref={modelRef}
          className="sensor-model"
          id="sensor-model"
          src={assetUrl(site.modelFile)}
          alt="Sensor Hiotera LIBOx actualizado en 3D, con antena, controles y conexiones"
          camera-orbit={`${sensorAnimation.initialYaw}deg ${sensorAnimation.initialPitch}deg ${sensorAnimation.initialRadius}%`}
          disable-zoom=""
          disable-pan=""
          interaction-prompt="none"
          touch-action="pan-y"
          shadow-intensity="1.1"
          exposure="1.05"
          environment-image="neutral"
          interpolation-decay="90"
          loading="eager"
          reveal="auto"
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
          <i /> desliza para recorrer
        </div>
        <div className="scene-counter">
          <b>{String(phase + 1).padStart(2, "0")}</b>
          <span>/</span>03
        </div>
        {!modelFailed && (
          <div ref={cueRef} className="wheel-cue" aria-hidden="true">
            <span className="wheel-icon">↕</span>
            <span>GIRA LA RUEDA PARA DESCUBRIR</span>
            <i />
          </div>
        )}
        {modelFailed && (
          <p className="model-error-message" role="status">
            El visor 3D no está disponible. Puedes seguir explorando Hiotera.
          </p>
        )}
      </div>
    </section>
  );
}

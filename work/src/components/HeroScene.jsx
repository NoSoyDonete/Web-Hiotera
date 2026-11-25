import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider.jsx";
import { assetUrl, site } from "../config.js";
import { heroPhases } from "../content.js";
import { useHeroPhases } from "../hooks/useHeroPhases.js";

export default function HeroScene({ onContact }) {
  const { localize } = useLanguage();
  const { phase, selectPhase, onTabKeyDown } = useHeroPhases();
  const [photoReady, setPhotoReady] = useState(false);
  const photoRef = useRef(null);
  // Si la foto ya estaba cargada (caché) antes de que React escuche su
  // evento load, la página no llegaba a mostrarse. Se marca lista igualmente,
  // y como seguro se muestra a los 2,5 s pase lo que pase.
  useEffect(() => {
    const ready = () => {
      setPhotoReady(true);
      document.documentElement.classList.add("app-ready");
    };
    if (photoRef.current?.complete) ready();
    const timeout = window.setTimeout(ready, 2500);
    return () => window.clearTimeout(timeout);
  }, []);

  // Los tres mensajes se turnan cada 4,5 s. Se detiene con el ratón o el foco
  // encima y no se mueve si el sistema pide reducir el movimiento.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const id = window.setInterval(
      () => selectPhase((current) => (current + 1) % heroPhases.length),
      4500,
    );
    return () => window.clearInterval(id);
  }, [paused, phase, selectPhase]);

  return localize(
    <section
      className="hero sensor-hero photo-hero"
      id="inicio"
      data-scene-stage={phase}
      aria-label="Presentación de Hiotera"
    >
      <div className="sensor-pin">
        <div className="hero-photo">
          <div className="sensor-radar" aria-hidden="true">
            <i />
          </div>
          <img
            ref={photoRef}
            className="sensor-fallback"
            src={assetUrl(site.installationPhoto)}
            alt="LIBOx instalado en un invernadero entre el cultivo"
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
        </div>
        <div
          className="hero-copy"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <h1 className="hero-title">
            Sensores para
            <br />
            <span>tu invernadero.</span>
          </h1>
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
                <p className="hero-phase-title">
                  {item.title} {item.highlight}
                </p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            <button className="button acid" onClick={onContact}>
              Cuéntanos qué quieres medir
            </button>
            <a className="button outline" href={heroPhases[0].action.href}>
              {heroPhases[0].action.label}
            </a>
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
      </div>
    </section>,
  );
}

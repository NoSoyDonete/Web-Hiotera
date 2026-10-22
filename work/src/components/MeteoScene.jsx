import { useRef, useState } from "react";
import { assetUrl } from "../config.js";
import {
  meteoParts,
  meteoModelFile,
  meteoCameraTarget,
  meteoCameraRadius,
} from "../meteo.js";
import { useMeteoScene } from "../hooks/useMeteoScene.js";
import "../meteo.css";

const number = (index) => String(index + 1).padStart(2, "0");

export default function MeteoScene() {
  const sectionRef = useRef(null),
    modelRef = useRef(null),
    progressRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const { status, stage } = useMeteoScene(sectionRef, modelRef, progressRef);
  const selectedIndex = Math.min(selected, meteoParts.length - 1);
  const part = meteoParts[selectedIndex];

  const zoom = (factor) => {
    const model = modelRef.current;
    const orbit = model.getCameraOrbit();
    const maxRadius = Math.max(18, meteoCameraRadius(model) * 2);
    const radius = Math.max(2.5, Math.min(maxRadius, orbit.radius * factor));
    model.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
  };
  const resetView = () => {
    const model = modelRef.current;
    model.cameraTarget = meteoCameraTarget;
    model.cameraOrbit = `-145deg 64deg ${meteoCameraRadius(model)}m`;
  };

  const goTo = (explosion) => {
    const section = sectionRef.current;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + travel * (0.08 + explosion * 0.8),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="meteo"
      className={`meteo-section meteo-${status}`}
      data-stage={stage}
      aria-labelledby="meteo-title"
    >
      <div className="meteo-pin">
        <div className="meteo-heading">
          <div className="section-label">ESTACIÓN METEOROLÓGICA / HIOTERA</div>
          <h2 id="meteo-title">
            Cada pieza.
            <br />
            <span>Una señal.</span>
          </h2>
          <p>
            El tiempo también forma parte de tu cultivo. Baja y descubre la
            estación, pieza a pieza.
          </p>
        </div>

        <div className="meteo-stage">
          <span className="meteo-watermark" aria-hidden="true">
            METEO
          </span>
          <model-viewer
            ref={modelRef}
            className="meteo-model"
            src={assetUrl(meteoModelFile)}
            alt="Estación meteorológica Hiotera completa en 3D. Arrastra para girar el modelo; baja para separar las piezas. El miniíndice destaca el anemómetro, la veleta, el embudo y el pluviómetro."
            animation-name="Despiece"
            animation-crossfade-duration="0"
            camera-target={meteoCameraTarget}
            camera-orbit="-145deg 64deg 10.5m"
            camera-controls=""
            min-camera-orbit="auto 10deg 2.5m"
            max-camera-orbit="auto 170deg auto"
            field-of-view="32deg"
            disable-zoom=""
            interaction-prompt="none"
            touch-action="pan-y"
            shadow-intensity="0.6"
            exposure="1.1"
            environment-image="neutral"
            loading="eager"
            reveal="auto"
          >
            {meteoParts.map((item, index) => (
              <button
                key={item.key}
                slot={`hotspot-${item.key}`}
                data-position={item.anchor.join(" ")}
                data-normal="0 1 0"
                className={`meteo-hotspot meteo-hotspot-${item.key}${selectedIndex === index ? " is-selected" : ""}`}
                onClick={() => setSelected(index)}
                aria-label={`Ver ${item.name}`}
                aria-pressed={selectedIndex === index}
              >
                <span>{number(index)}</span>
                <b>{item.name}</b>
              </button>
            ))}
          </model-viewer>
          <div
            className="meteo-camera-tools"
            role="group"
            aria-label="Controles de la vista 3D"
          >
            <button
              type="button"
              onClick={() => zoom(0.8)}
              disabled={status !== "ready"}
              aria-label="Acercar el modelo"
              title="Acercar"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => zoom(1.25)}
              disabled={status !== "ready"}
              aria-label="Alejar el modelo"
              title="Alejar"
            >
              −
            </button>
            <button
              type="button"
              onClick={resetView}
              disabled={status !== "ready"}
              aria-label="Restablecer la vista 3D"
              title="Restablecer vista"
            >
              ↺
            </button>
          </div>
          <p className="meteo-camera-hint">
            Arrastra para girar · + y − para acercar
          </p>
          {status === "loading" && (
            <p className="meteo-loading" role="status">
              Cargando la estación 3D…
            </p>
          )}
          {status === "error" && (
            <div className="meteo-fallback" role="status">
              <p>No se ha podido cargar la vista 3D.</p>
              <a href={assetUrl(meteoModelFile)} download>
                Descargar el modelo de la meteo ↗
              </a>
            </div>
          )}
          <div className="meteo-view-label">
            <span className="meteo-live-dot" />
            HIOTERA / ESTACIÓN METEOROLÓGICA
          </div>
        </div>

        <aside
          className="meteo-parts"
          aria-label="Partes de la estación meteorológica"
        >
          <div className="meteo-parts-caption">
            {String(meteoParts.length).padStart(2, "0")} PARTES DESTACADAS
          </div>
          <div className="meteo-part-list">
            {meteoParts.map((item, index) => (
              <button
                type="button"
                key={item.key}
                className={selectedIndex === index ? "is-selected" : ""}
                aria-pressed={selectedIndex === index}
                onClick={() => setSelected(index)}
              >
                <span>{number(index)}</span>
                {item.name}
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
          <div
            className="meteo-part-detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{part.category}</span>
            <p>{part.description}</p>
          </div>
        </aside>

        <div className="meteo-transport">
          <div className="meteo-scroll-hint">
            <span aria-hidden="true">↓</span>
            <p>
              {stage === "exploded"
                ? "Cada pieza, al descubierto"
                : "Baja para separar las piezas"}
              <small>Sube para volver a montarlas</small>
            </p>
          </div>
          <div
            className="meteo-progress"
            ref={progressRef}
            role="progressbar"
            aria-label="Separación de las piezas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <div>
              <i />
            </div>
            <b>0%</b>
          </div>
          <div className="meteo-view-buttons">
            <button
              type="button"
              onClick={() => goTo(0)}
              disabled={status !== "ready"}
            >
              Montada
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={status !== "ready"}
            >
              Despiece <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

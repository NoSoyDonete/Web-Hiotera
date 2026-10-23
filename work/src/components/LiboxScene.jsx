import { useCallback, useEffect, useRef, useState } from "react";
import { assetUrl, site } from "../config.js";
import { liboxOverview, liboxParts } from "../libox.js";

const label = (index) => String(index + 1).padStart(2, "0");

export default function LiboxScene() {
  const modelRef = useRef(null),
    selectedRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");

  const select = useCallback((index) => {
    selectedRef.current = index;
    setSelected(index);
    const model = modelRef.current;
    if (model?.loaded) {
      model.resetTurntableRotation?.();
      model.cameraOrbit = liboxParts[index].orbit;
    }
  }, []);

  useEffect(() => {
    const model = modelRef.current;
    let disposed = false;
    let ready = false;
    const loaded = () => {
      if (disposed || ready) return;
      ready = true;
      if (selectedRef.current !== null)
        model.cameraOrbit = liboxParts[selectedRef.current].orbit;
      setStatus("ready");
    };
    const error = () => {
      if (!disposed) {
        ready = false;
        setStatus("error");
      }
    };
    const explore = (event) => {
      const index = liboxParts.findIndex((part) => part.key === event.detail);
      if (index >= 0) select(index);
    };
    model.addEventListener("load", loaded);
    model.addEventListener("error", error);
    window.addEventListener("hiotera:libox-part", explore);
    import("@google/model-viewer")
      .then(() => {
        if (model.loaded) loaded();
      })
      .catch(error);
    return () => {
      disposed = true;
      model.removeEventListener("load", loaded);
      model.removeEventListener("error", error);
      window.removeEventListener("hiotera:libox-part", explore);
    };
  }, [select]);
  const reset = () => {
    setSelected(null);
    selectedRef.current = null;
    modelRef.current.resetTurntableRotation?.();
    modelRef.current.cameraOrbit = liboxOverview;
    modelRef.current.cameraTarget = "auto auto auto";
  };
  const zoom = (factor) => {
    const model = modelRef.current,
      orbit = model.getCameraOrbit();
    model.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${Math.max(0.18, Math.min(1.5, orbit.radius * factor))}m`;
  };
  const part = selected === null ? null : liboxParts[selected];

  return (
    <section
      id="nodo"
      className={`libox-section libox-${status}`}
      aria-labelledby="libox-title"
    >
      <div className="libox-pin">
        <div className="libox-heading">
          <div className="section-label">
            01 / EL NODO. POR DENTRO Y POR FUERA.
          </div>
          <h2 id="libox-title">
            Pequeño por fuera.
            <br />
            <span>Conectado a todo.</span>
          </h2>
          <p>
            Este es el LIBOx. Gíralo, acércate y descubre qué conecta cada
            salida y qué hace cada mando.
          </p>
        </div>
        <div className="libox-stage">
          <span className="libox-watermark" aria-hidden="true">
            LIBOx
          </span>
          <model-viewer
            ref={modelRef}
            className="libox-model"
            src={assetUrl(site.modelFile)}
            alt="LIBOx de Hiotera sin cables. Modelo 3D con conexiones para temperatura, tensiómetros, radiación, placa solar, reinicio y encendido."
            camera-orbit={liboxOverview}
            camera-controls=""
            disable-zoom=""
            touch-action="pan-y"
            min-camera-orbit="auto 15deg 0.18m"
            max-camera-orbit="auto 165deg 1.5m"
            interaction-prompt="none"
            shadow-intensity="0.8"
            exposure="1.1"
            environment-image="neutral"
            interpolation-decay="140"
            loading="lazy"
            reveal="auto"
          >
            {liboxParts.flatMap((item, index) =>
              item.anchors.map((anchor, point) => (
                <button
                  key={`${item.key}-${point}`}
                  slot={`hotspot-${item.key}-${point}`}
                  data-position={anchor.join(" ")}
                  data-normal={item.normals[point].join(" ")}
                  className={`libox-hotspot${selected === index ? " is-selected" : ""}`}
                  aria-label={`Ver ${item.name}${item.anchors.length > 1 ? `, conector ${point + 1}` : ""}`}
                  aria-pressed={selected === index}
                  onClick={() => select(index)}
                >
                  <span>{label(index)}</span>
                  {point === 0 && <b>{item.tag}</b>}
                </button>
              )),
            )}
          </model-viewer>
          <div
            className="libox-tools"
            role="group"
            aria-label="Controles del LIBOx 3D"
          >
            <button
              onClick={() => zoom(0.8)}
              disabled={status !== "ready"}
              aria-label="Acercar LIBOx"
            >
              +
            </button>
            <button
              onClick={() => zoom(1.25)}
              disabled={status !== "ready"}
              aria-label="Alejar LIBOx"
            >
              −
            </button>
            <button
              onClick={reset}
              disabled={status !== "ready"}
              aria-label="Restablecer vista del LIBOx"
            >
              ↺
            </button>
          </div>
          <div className="libox-model-caption">
            <span>LIBOx / VISTA SIN CABLES</span>
            <span>ARRASTRA PARA GIRAR · PULSA LOS PUNTOS</span>
          </div>
          {status === "loading" && (
            <p className="libox-status" role="status">
              Preparando el LIBOx…
            </p>
          )}
          {status === "error" && (
            <div className="libox-status" role="status">
              <p>
                No se ha podido cargar el 3D. Puedes explorar las funciones en
                el índice.
              </p>
              <a href={assetUrl(site.modelFile)} download>
                Descargar modelo ↗
              </a>
            </div>
          )}
        </div>
        <aside
          className="libox-guide"
          aria-label="Conexiones y controles del LIBOx"
        >
          <div className="libox-guide-label">
            TOCA PARA EXPLORAR <span>↗</span>
          </div>
          <div className="libox-parts-list">
            {liboxParts.map((item, index) => (
              <button
                key={item.key}
                aria-pressed={selected === index}
                className={selected === index ? "is-selected" : ""}
                onClick={() => select(index)}
              >
                <span>{label(index)}</span>
                {item.name}
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
          <div className="libox-detail" aria-live="polite" aria-atomic="true">
            <span>{part?.category ?? "UN MISMO NODO. DISTINTAS SEÑALES."}</span>
            <h3>{part?.name ?? "Cada conexión tiene un porqué."}</h3>
            <p>
              {part?.description ??
                "El suelo, la radiación y la energía llegan a un mismo punto. Selecciona una conexión o un control para verlo de cerca y conocer su función."}
            </p>
            {selected === 1 && (
              <div className="depth-indicators">
                <span>↓ 15 cm</span>
                <span>↓ 30 cm</span>
              </div>
            )}
          </div>
        </aside>
        <a className="libox-next" href="#meteo">
          Y ahora, mira al cielo.<span>DESCUBRE LA METEO ↓</span>
        </a>
      </div>
    </section>
  );
}

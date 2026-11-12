import { useLanguage } from "./LanguageProvider.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { assetUrl, site } from "../config.js";
import { liboxOverview, liboxPartModel, liboxParts } from "../libox.js";

const label = (index) => String(index + 1).padStart(2, "0");

export default function LiboxScene() {
  const { localize } = useLanguage();
  const modelRef = useRef(null),
    partModelRef = useRef(null),
    partFileRef = useRef(null),
    selectedRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");
  // Modelo del sensor del conector elegido. Se muestra en lugar del LIBOx
  // cuando termina de cargar, para que la transición no deje el hueco vacío.
  const [partFile, setPartFile] = useState(null);
  const [partReady, setPartReady] = useState(false);

  const part = selected === null ? null : liboxParts[selected];
  const partModel = liboxPartModel(part);
  const showingPart = Boolean(partModel) && partReady;

  const select = useCallback((index) => {
    selectedRef.current = index;
    setSelected(index);
    const sensor = liboxPartModel(liboxParts[index]);
    if (sensor) {
      if (partFileRef.current !== sensor.file) setPartReady(false);
      partFileRef.current = sensor.file;
      setPartFile(sensor.file);
      return;
    }
    // Sin modelo propio: vuelve al LIBOx y encuadra ese punto.
    partFileRef.current = null;
    setPartFile(null);
    setPartReady(false);
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
      const index = liboxParts.findIndex((item) => item.key === event.detail);
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

  // Carga del modelo del sensor elegido.
  useEffect(() => {
    const viewer = partModelRef.current;
    if (!viewer || !partFile) return;
    let disposed = false;
    const loaded = () => {
      if (!disposed) setPartReady(true);
    };
    const failed = () => {
      // Si falla, se queda el LIBOx con la descripción del conector.
      if (disposed) return;
      partFileRef.current = null;
      setPartFile(null);
    };
    viewer.addEventListener("load", loaded);
    viewer.addEventListener("error", failed);
    import("@google/model-viewer").then(() => {
      if (viewer.loaded && viewer.src.endsWith(partFile)) loaded();
    });
    return () => {
      disposed = true;
      viewer.removeEventListener("load", loaded);
      viewer.removeEventListener("error", failed);
    };
  }, [partFile]);

  const backToLibox = () => {
    setSelected(null);
    selectedRef.current = null;
    partFileRef.current = null;
    setPartFile(null);
    setPartReady(false);
    const model = modelRef.current;
    model.resetTurntableRotation?.();
    model.cameraOrbit = liboxOverview;
    model.cameraTarget = "auto auto auto";
  };
  const reset = () => {
    if (showingPart) {
      const viewer = partModelRef.current;
      viewer.resetTurntableRotation?.();
      viewer.cameraOrbit = partModel.orbit;
      viewer.cameraTarget = "auto auto auto";
      return;
    }
    backToLibox();
  };
  const zoom = (factor) => {
    const model = showingPart ? partModelRef.current : modelRef.current,
      orbit = model.getCameraOrbit();
    const radius = showingPart
      ? orbit.radius * factor
      : Math.max(0.18, Math.min(1.5, orbit.radius * factor));
    model.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
  };

  return localize(
    <section
      id="nodo"
      className={`libox-section libox-${status}${showingPart ? " libox-showing-part" : ""}`}
      aria-labelledby="libox-title"
    >
      <div className="libox-pin">
        <div className="libox-heading">
          <div className="section-label">01 / Nuestro LIBOx</div>
          <h2 id="libox-title">
            Tus sensores.
            <br />
            <span>Un mismo equipo.</span>
          </h2>
          <p>
            El LIBOx conecta los sensores con la aplicación. Gira el modelo y
            pulsa los números para ver dónde se enchufa cada sensor y para qué
            sirve cada botón.
          </p>
        </div>
        <div className="libox-stage">
          <span className="libox-watermark" aria-hidden="true">
            LIBOx
          </span>
          <model-viewer
            ref={modelRef}
            className="libox-model"
            style={status === "ready" ? undefined : { visibility: "hidden" }}
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
            inert={showingPart}
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
          {partFile && (
            <model-viewer
              ref={partModelRef}
              className="libox-part-model"
              src={assetUrl(partFile)}
              alt={`Modelo 3D de ${part?.name ?? ""}`}
              camera-orbit={partModel?.orbit}
              orientation={partModel?.orientation ?? "0deg 0deg 0deg"}
              camera-controls=""
              disable-zoom=""
              disable-pan=""
              touch-action="pan-y"
              min-camera-orbit="auto 12deg 30%"
              max-camera-orbit="auto 168deg 300%"
              interaction-prompt="none"
              shadow-intensity="0.8"
              exposure="1.1"
              environment-image="neutral"
              interpolation-decay="140"
              reveal="auto"
              inert={!showingPart}
            />
          )}
          {partModel && !partReady && (
            <p className="libox-part-loading" role="status">
              Cargando {part.name}…
            </p>
          )}
          {showingPart && (
            <button
              type="button"
              className="libox-back"
              onClick={backToLibox}
            >
              <span aria-hidden="true">←</span> Volver al LIBOx
            </button>
          )}
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
            <span>{part?.category ?? "SENSORES, CARGA Y CONTROLES"}</span>
            <h3>{part?.name ?? "¿Qué se conecta aquí?"}</h3>
            <p>
              {part?.description ??
                "Pulsa un número para ver qué sensor se conecta en ese punto. También puedes localizar la carga solar y los botones de encendido y reinicio."}
            </p>
            {selected === 1 && (
              <div className="depth-indicators">
                <span>↓ 15 cm</span>
                <span>↓ 30 cm</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>,
  );
}

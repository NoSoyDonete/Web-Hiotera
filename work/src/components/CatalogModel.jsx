import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../config.js";
import "../catalog-model.css";

function ModelViewer({ item, large, onExpand }) {
  const frameRef = useRef(null),
    viewerRef = useRef(null);
  const [near, setNear] = useState(large);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (near) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [near]);
  useEffect(() => {
    if (!near) return;
    const viewer = viewerRef.current;
    let disposed = false;
    const loaded = () => {
      if (!disposed) setStatus("ready");
    };
    const failed = () => {
      if (!disposed) setStatus("error");
    };
    setStatus("loading");
    viewer.addEventListener("load", loaded);
    viewer.addEventListener("error", failed);
    import("@google/model-viewer")
      .then(() => {
        if (viewer.loaded) loaded();
      })
      .catch(failed);
    return () => {
      disposed = true;
      viewer.removeEventListener("load", loaded);
      viewer.removeEventListener("error", failed);
    };
  }, [near, attempt, item.model.file]);
  const reset = () => {
    const viewer = viewerRef.current;
    viewer.resetTurntableRotation?.();
    viewer.cameraOrbit = item.model.orbit;
    viewer.cameraTarget = "auto auto auto";
  };
  const zoom = (factor) => {
    const viewer = viewerRef.current;
    const orbit = viewer.getCameraOrbit();
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * factor}m`;
  };
  return (
    <figure
      ref={frameRef}
      className={`catalog-model-frame catalog-model-${status}`}
    >
      {near && (
        <model-viewer
          key={attempt}
          ref={viewerRef}
          className="catalog-model-viewer"
          src={assetUrl(item.model.file)}
          alt={`Modelo 3D de ${item.name}. Arrastra o usa las flechas del teclado para girarlo.`}
          camera-controls=""
          disable-zoom=""
          disable-pan=""
          touch-action="pan-y"
          camera-orbit={item.model.orbit}
          orientation={item.model.orientation ?? "0deg 0deg 0deg"}
          min-camera-orbit="auto 12deg 30%"
          max-camera-orbit="auto 168deg 300%"
          interaction-prompt="none"
          environment-image="neutral"
          exposure="1.05"
          shadow-intensity="0.65"
          shadow-softness="0.9"
          loading="lazy"
          reveal="auto"
        />
      )}
      {status !== "ready" && (
        <div className="catalog-model-status" role="status">
          {status === "error" ? (
            <>
              <span>No se ha podido cargar el modelo.</span>
              <button onClick={() => setAttempt((value) => value + 1)}>
                Reintentar ↗
              </button>
            </>
          ) : (
            <span>{near ? "Preparando vista 3D…" : "VISTA 3D"}</span>
          )}
        </div>
      )}
      <div
        className="catalog-model-tools"
        role="group"
        aria-label={`Controles 3D de ${item.name}`}
      >
        {large && (
          <>
            <button
              disabled={status !== "ready"}
              aria-label={`Acercar ${item.name}`}
              onClick={() => zoom(0.8)}
            >
              +
            </button>
            <button
              disabled={status !== "ready"}
              aria-label={`Alejar ${item.name}`}
              onClick={() => zoom(1.25)}
            >
              −
            </button>
          </>
        )}
        <button
          disabled={status !== "ready"}
          aria-label={`Restablecer vista de ${item.name}`}
          onClick={reset}
        >
          ↺
        </button>
        {!large && (
          <button
            aria-label={`Ampliar modelo 3D de ${item.name}`}
            onClick={() => onExpand(item)}
          >
            ↗
          </button>
        )}
      </div>
      <figcaption>
        <span>{item.modelNote ?? "MODELO 3D"}</span>
        <span>ARRASTRA PARA GIRAR{large ? " · + / − PARA ACERCAR" : ""}</span>
      </figcaption>
    </figure>
  );
}

export default function CatalogModel({ item, large = false, onExpand }) {
  if (!item.model)
    return (
      <div className="catalog-model-pending">
        <span aria-hidden="true">3D</span>
        <p>Modelo pendiente</p>
        <small>
          Se añadirá cuando esté disponible el archivo del tensiómetro
          analógico.
        </small>
      </div>
    );
  return <ModelViewer item={item} large={large} onExpand={onExpand} />;
}

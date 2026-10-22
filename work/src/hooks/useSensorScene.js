import { useEffect, useState } from "react";
import { sensorAnimation as settings } from "../config.js";

const clamp = (value) => Math.max(0, Math.min(1, value));
const smoother = (value) => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

// Mantiene los fotogramas del 3D fuera de los renders de React. El estado de React
// solo cambia al cargar el modelo, cambiar de texto o producirse un error.
export function useSensorScene(sectionRef, modelRef) {
  const [phase, setPhase] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const model = modelRef.current;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      progress = 0,
      target = 0,
      previousFrame = 0,
      currentPhase = 0,
      lastOrbit = "";
    let modelLoaded = false,
      manualCamera = false,
      failed = false,
      disposed = false;
    // El encuadre pertenece al CSS, también después de una actualización en caliente.
    for (const property of [
      "left",
      "top",
      "width",
      "height",
      "transform",
      "opacity",
    ]) {
      model.style.removeProperty(property);
    }

    const sceneProgress = () => {
      const travel = section.offsetHeight - window.innerHeight;
      return travel > 0
        ? clamp(-section.getBoundingClientRect().top / travel)
        : 0;
    };

    const render = (timestamp) => {
      frame = 0;
      if (disposed || failed) return;
      const delta = previousFrame
        ? Math.min(timestamp - previousFrame, 50)
        : 16;
      previousFrame = timestamp;
      progress = reducedMotion.matches
        ? target
        : progress +
          (target - progress) * (1 - Math.exp(-delta / settings.smoothingMs));
      if (Math.abs(target - progress) < 0.0005) progress = target;
      const nextPhase = Math.min(2, Math.floor(progress * 3));
      if (nextPhase !== currentPhase) {
        currentPhase = nextPhase;
        setPhase(nextPhase);
      }
      if (modelLoaded && !manualCamera) {
        const rotation = clamp(progress / settings.rotationEnd);
        const turn = reducedMotion.matches ? 0 : smoother(rotation);
        const yaw = settings.initialYaw + turn * settings.rotationDegrees;
        const orbit = `${yaw}deg ${settings.pitch}deg ${settings.radius}%`;
        // La órbita manual se conserva mientras no cambie el recorrido del scroll.
        if (orbit !== lastOrbit) {
          model.cameraOrbit = orbit;
          lastOrbit = orbit;
        }
      }
      if (progress !== target) frame = requestAnimationFrame(render);
    };
    const update = (event) => {
      if (disposed || failed) return;
      const nextTarget = sceneProgress();
      if (nextTarget !== target && event?.type !== "resize") manualCamera = false;
      target = nextTarget;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const cameraChanged = (event) => {
      if (disposed || failed || event.detail?.source !== "user-interaction")
        return;
      manualCamera = true;
      // El arrastre también interrumpe la inercia de un scroll anterior.
      progress = target;
    };
    const loaded = () => {
      if (disposed || modelLoaded) return;
      modelLoaded = true;
      failed = false;
      manualCamera = false;
      lastOrbit = "";
      progress = target = sceneProgress();
      setModelReady(true);
      setModelFailed(false);
      update();
    };
    const error = () => {
      if (disposed) return;
      failed = true;
      modelLoaded = false;
      cancelAnimationFrame(frame);
      frame = 0;
      setModelReady(false);
      setModelFailed(true);
      setPhase(0);
      currentPhase = 0;
    };
    model.addEventListener("load", loaded);
    model.addEventListener("error", error);
    model.addEventListener("camera-change", cameraChanged);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reducedMotion.addEventListener("change", update);
    // Se empaqueta con la web; no requiere cargar el visor desde un CDN.
    import("@google/model-viewer")
      .then(() => {
        if (!disposed && model.loaded) loaded();
      })
      .catch(error);
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      model.removeEventListener("load", loaded);
      model.removeEventListener("error", error);
      model.removeEventListener("camera-change", cameraChanged);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [sectionRef, modelRef]);

  return { phase, modelReady, modelFailed };
}

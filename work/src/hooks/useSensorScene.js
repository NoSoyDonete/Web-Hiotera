import { useEffect, useState } from "react";
import { sensorAnimation as settings } from "../config.js";

const clamp = (value) => Math.max(0, Math.min(1, value));
const smoother = (value) => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

// Mantiene los fotogramas del 3D fuera de los renders de React. El estado de React
// solo cambia al cargar el modelo, cambiar de texto o producirse un error.
export function useSensorScene(sectionRef, pinRef, modelRef, cueRef) {
  const [phase, setPhase] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const model = modelRef.current;
    const root = document.documentElement;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      progress = 0,
      target = 0,
      previousFrame = 0,
      currentPhase = 0;
    let controlsEnabled = false,
      failed = false,
      disposed = false;
    root.classList.add("scroll-intro");
    root.classList.remove("intro-landed");
    model.style.opacity = "0";

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
      const rawIntro = clamp(progress / settings.introEnd);
      const intro = smoother(rawIntro);
      root.classList.toggle("intro-landed", rawIntro >= settings.landingStart);
      cueRef.current?.style.setProperty("--intro-progress", String(rawIntro));
      pin.style.setProperty(
        "--digital-scene",
        String(smoother((rawIntro - 0.1) / 0.45)),
      );
      model.style.opacity = String(smoother(rawIntro / settings.revealEnd));

      const width = window.innerWidth,
        height = window.innerHeight;
      let from = {
        left: 41,
        top: 49,
        width: Math.min(width * 0.9, 1120),
        height: height * 1.25,
      };
      let to = {
        left: 36 + (Math.min(width * 0.7, 980) / width) * 50,
        top: 50,
        width: Math.min(width * 0.7, 980),
        height: Math.min(height * 0.91, 940),
      };
      if (width <= 900) {
        from = {
          left: 41,
          top: 48,
          width: Math.min(width * 0.88, 760),
          height: height * 0.58,
        };
        to = { left: 68, top: 43, width: width * 0.92, height: height * 0.74 };
      }
      if (width <= 560) {
        from = {
          left: 37,
          top: 45,
          width: Math.min(width * 1.05, 520),
          height: height * 0.58,
        };
        to = {
          left: 63.5,
          top: 30,
          width: width * 1.15,
          height: height * 0.58,
        };
      }
      for (const key of ["left", "top", "width", "height"]) {
        model.style[key] =
          `${from[key] + (to[key] - from[key]) * intro}${key === "left" || key === "top" ? "%" : "px"}`;
      }
      // Un solo punto de anclaje durante todo el recorrido evita el salto al llegar.
      model.style.transform = "translate(-50%,-50%)";
      const enableControls = rawIntro >= settings.controlsStart;
      if (enableControls !== controlsEnabled) {
        controlsEnabled = enableControls;
        model.toggleAttribute("camera-controls", controlsEnabled);
      }
      const nextPhase = Math.min(
        2,
        Math.floor(
          clamp((progress - settings.introEnd) / (1 - settings.introEnd)) * 3,
        ),
      );
      if (nextPhase !== currentPhase) {
        currentPhase = nextPhase;
        setPhase(nextPhase);
      }
      const turn = reducedMotion.matches ? rawIntro * 0.1 : intro;
      const yaw = settings.initialYaw + turn * settings.rotationDegrees;
      const pitch = reducedMotion.matches
        ? settings.initialPitch
        : settings.initialPitch - Math.sin(intro * Math.PI) * 7;
      const radius =
        settings.initialRadius +
        intro * (settings.finalRadius - settings.initialRadius);
      model.cameraOrbit = `${yaw}deg ${pitch}deg ${radius}%`;
      if (progress !== target) frame = requestAnimationFrame(render);
    };
    const update = () => {
      const travel = section.offsetHeight - window.innerHeight;
      target =
        travel > 0 ? clamp(-section.getBoundingClientRect().top / travel) : 0;
      if (!frame && !failed) frame = requestAnimationFrame(render);
    };
    const loaded = () => {
      if (!disposed) {
        setModelReady(true);
        update();
      }
    };
    const error = () => {
      if (disposed) return;
      failed = true;
      cancelAnimationFrame(frame);
      setModelFailed(true);
      setPhase(0);
      root.classList.remove("scroll-intro");
      root.classList.add("intro-landed");
    };
    model.addEventListener("load", loaded);
    model.addEventListener("error", error);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reducedMotion.addEventListener("change", update);
    // Se empaqueta con la web; no requiere cargar el visor desde un CDN.
    import("@google/model-viewer")
      .then(() => {
        if (model.loaded) loaded();
      })
      .catch(error);
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      model.removeEventListener("load", loaded);
      model.removeEventListener("error", error);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener("change", update);
      root.classList.remove("scroll-intro", "intro-landed");
    };
  }, [sectionRef, pinRef, modelRef, cueRef]);

  return { phase, modelReady, modelFailed };
}

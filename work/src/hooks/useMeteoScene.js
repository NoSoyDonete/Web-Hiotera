import { useEffect, useState } from "react";
import { meteoParts, meteoProgress, meteoCameraRadius } from "../meteo.js";

export function useMeteoScene(sectionRef, modelRef, progressRef) {
  const [status, setStatus] = useState("loading");
  const [stage, setStage] = useState("assembled");

  useEffect(() => {
    const section = sectionRef.current;
    const model = modelRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      ready = false,
      frame = 0,
      previousTime = 0;
    let previousRadius = null;
    let progress = meteoProgress(section),
      target = progress,
      lastStage = "";

    const draw = (time) => {
      frame = 0;
      if (disposed || !ready) return;
      const delta = previousTime ? Math.min(time - previousTime, 50) : 16;
      previousTime = time;
      progress = reduced.matches
        ? target
        : progress + (target - progress) * (1 - Math.exp(-delta / 110));
      if (Math.abs(target - progress) < 0.0001) progress = target;
      // El GLB incluye el easing de las piezas: las etiquetas lo siguen.
      const separation = progress * progress * (3 - 2 * progress);
      model.currentTime = Math.min(model.duration - 0.0001, 2.5 + progress * 4);
      for (const part of meteoParts) {
        model.updateHotspot({
          name: `hotspot-${part.key}`,
          position: part.anchor
            .map((value, axis) => value + part.offset[axis] * separation)
            .join(" "),
          normal: "0 1 0",
        });
      }
      section.dataset.explosion = progress.toFixed(3);
      const percent = Math.round(progress * 100);
      if (progressRef.current) {
        progressRef.current.style.setProperty(
          "--meteo-progress",
          String(progress),
        );
        progressRef.current.setAttribute("aria-valuenow", String(percent));
        progressRef.current.querySelector("b").textContent = `${percent}%`;
      }
      const nextStage =
        progress < 0.08
          ? "assembled"
          : progress > 0.98
            ? "exploded"
            : "separating";
      if (nextStage !== lastStage) {
        lastStage = nextStage;
        setStage(nextStage);
      }
      if (progress !== target) frame = requestAnimationFrame(draw);
    };
    const update = () => {
      target = meteoProgress(section);
      if (ready && !frame) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      // Una distancia explícita evita que cambie el encuadre al animar el GLB.
      const radius = meteoCameraRadius(model);
      model.maxCameraOrbit = `auto 170deg ${Math.max(18, radius * 2)}m`;
      if (ready && previousRadius) {
        const orbit = model.getCameraOrbit();
        // Reencuadrar al cambiar de tamaño conserva el giro y el zoom elegidos.
        model.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${(orbit.radius * radius) / previousRadius}m`;
      } else {
        model.cameraOrbit = `-145deg 64deg ${radius}m`;
      }
      previousRadius = radius;
      update();
    };
    const loaded = async () => {
      await model.updateComplete;
      if (disposed) return;
      if (
        !model.availableAnimations.includes("Despiece") ||
        model.duration <= 0
      ) {
        failed();
        return;
      }
      model.pause();
      ready = true;
      setStatus("ready");
      progress = target = meteoProgress(section);
      resize();
    };
    const failed = () => {
      if (disposed) return;
      ready = false;
      cancelAnimationFrame(frame);
      setStatus("error");
    };
    model.addEventListener("load", loaded);
    model.addEventListener("error", failed);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    reduced.addEventListener("change", update);
    const observer = new ResizeObserver(resize);
    observer.observe(model);
    import("@google/model-viewer")
      .then(() => {
        if (model.loaded) loaded();
      })
      .catch(failed);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      model.removeEventListener("load", loaded);
      model.removeEventListener("error", failed);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", update);
    };
  }, [sectionRef, modelRef, progressRef]);
  return { status, stage };
}

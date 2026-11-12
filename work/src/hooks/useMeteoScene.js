import { useCallback, useEffect, useRef, useState } from "react";
import { meteoParts, meteoCameraRadius } from "../meteo.js";
import { createMeteoPlayback } from "../meteoPlayback.js";

const clamp = (value) => Math.max(0, Math.min(1, value));
// Píxeles de rueda necesarios para pasar de montada a despiece completo.
const WHEEL_TRAVEL = 900;

export function useMeteoScene(sectionRef, modelRef, progressRef) {
  // Permite a los botones «Montada» y «Despiece» fijar la separación.
  const explodeRef = useRef(() => {});
  const setExplosion = useCallback((value) => explodeRef.current(value), []);
  const [status, setStatus] = useState("loading");
  const [stage, setStage] = useState("assembled");
  const [motionEnabled, setMotionEnabled] = useState(
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const motionRef = useRef(motionEnabled);
  const playbackRef = useRef(null);
  const toggleMotion = useCallback(
    () => setMotionEnabled((enabled) => !enabled),
    [],
  );

  useEffect(() => {
    motionRef.current = motionEnabled;
    playbackRef.current?.sync();
  }, [motionEnabled]);

  useEffect(() => {
    const section = sectionRef.current;
    const model = modelRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      ready = false,
      frame = 0,
      previousTime = 0;
    let previousRadius = null;
    // La separación ya no depende del scroll de la página: solo cambia con la
    // rueda dentro del círculo del modelo o con los botones.
    let progress = 0,
      target = 0,
      lastStage = "";
    const stage = model.parentElement;
    const playback = createMeteoPlayback(
      model,
      () => ready && motionRef.current && !document.hidden,
    );
    playbackRef.current = playback;

    const draw = (time) => {
      frame = 0;
      if (disposed || !ready) return;
      const delta = previousTime ? Math.min(time - previousTime, 50) : 16;
      previousTime = time;
      progress = reduced.matches
        ? target
        : progress + (target - progress) * (1 - Math.exp(-delta / 90));
      if (Math.abs(target - progress) < 0.0001) progress = target;
      // El GLB incluye el easing de las piezas: las etiquetas lo siguen.
      const separation = progress * progress * (3 - 2 * progress);
      model.appendAnimation("Despiece", {
        time: Math.min(6.5 - 0.0001, 2.5 + progress * 4),
        timeScale: 0,
        fade: false,
      });
      playback.sync(true);
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
      if (ready && !frame) frame = requestAnimationFrame(draw);
    };
    explodeRef.current = (value) => {
      target = clamp(value);
      update();
    };
    // Rueda del ratón: solo actúa dentro del círculo dibujado alrededor del
    // modelo (.meteo-stage::before). Al llegar a montada o a despiece completo
    // deja pasar el scroll para que la página siga bajando o subiendo.
    const insideCircle = (event) => {
      const rect = stage.getBoundingClientRect();
      const ratio =
        parseFloat(getComputedStyle(stage, "::before").width) /
          stage.clientWidth || 0.76;
      const radius = (rect.width * ratio) / 2;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      return dx * dx + dy * dy <= radius * radius;
    };
    const wheel = (event) => {
      if (!ready || event.ctrlKey || !insideCircle(event)) return;
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      const pixels = event.deltaY * unit;
      if ((pixels > 0 && target >= 1) || (pixels < 0 && target <= 0)) return;
      event.preventDefault();
      target = clamp(target + pixels / WHEEL_TRAVEL);
      update();
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
      if (disposed || ready) return;
      if (
        !["Despiece", "Viento", "Veleta", "Lluvia"].every((name) =>
          model.availableAnimations.includes(name),
        ) ||
        typeof model.appendAnimation !== "function"
      ) {
        failed();
        return;
      }
      model.play();
      model.appendAnimation("Veleta", { fade: false });
      model.appendAnimation("Lluvia", { fade: false });
      ready = true;
      playback.sync();
      setStatus("ready");
      resize();
    };
    const visibilityChanged = () => playback.sync();
    const preferenceChanged = () => {
      motionRef.current = !reduced.matches;
      setMotionEnabled(!reduced.matches);
      playback.sync();
      update();
    };
    const failed = () => {
      if (disposed) return;
      ready = false;
      cancelAnimationFrame(frame);
      playback.sync();
      setStatus("error");
    };
    model.addEventListener("load", loaded);
    model.addEventListener("error", failed);
    stage.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("resize", resize);
    reduced.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
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
      stage.removeEventListener("wheel", wheel);
      explodeRef.current = () => {};
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      playback.dispose();
      if (playbackRef.current === playback) playbackRef.current = null;
    };
  }, [sectionRef, modelRef, progressRef]);
  return { status, stage, motionEnabled, toggleMotion, setExplosion };
}

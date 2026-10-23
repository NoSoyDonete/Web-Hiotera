import { useEffect, useState } from "react";
import { heroPhases } from "../content.js";

export const heroPhaseAt = (progress) =>
  Math.min(
    heroPhases.length - 1,
    Math.floor(Math.max(0, Math.min(1, progress)) * heroPhases.length),
  );

// Solo sincroniza los textos originales. La portada no carga ningún visor 3D.
export function useHeroPhases(sectionRef) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const section = sectionRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      previousTime = 0,
      progress = 0,
      target = 0;
    let disposed = false;
    const draw = (time) => {
      frame = 0;
      if (disposed) return;
      const delta = previousTime ? Math.min(time - previousTime, 50) : 16;
      previousTime = time;
      progress = reduced.matches
        ? target
        : progress + (target - progress) * (1 - Math.exp(-delta / 145));
      if (Math.abs(target - progress) < 0.0005) progress = target;
      setPhase(heroPhaseAt(progress));
      if (progress !== target) frame = requestAnimationFrame(draw);
    };
    const update = () => {
      const travel = section.offsetHeight - window.innerHeight;
      target =
        travel > 0
          ? Math.max(
              0,
              Math.min(1, -section.getBoundingClientRect().top / travel),
            )
          : 0;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    const observer = new ResizeObserver(update);
    observer.observe(section);
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
    };
  }, [sectionRef]);
  return phase;
}

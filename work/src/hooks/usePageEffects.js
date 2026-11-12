import { useEffect, useRef } from "react";
import { installHashNavigation } from "../hashNavigation.js";

export function usePageEffects() {
  const progressRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  // React crea las secciones después del intento inicial de navegar al fragmento.
  useEffect(() => installHashNavigation(), []);

  useEffect(() => {
    let frame = 0;
    const drawProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      const meteo = document.getElementById("meteo");
      if (meteo) {
        const bounds = meteo.getBoundingClientRect();
        document
          .querySelector(".topbar")
          ?.classList.toggle(
            "on-meteo",
            bounds.top <= 70 && bounds.bottom > 70,
          );
      }
    };
    const scheduleProgress = () => {
      if (!frame) frame = requestAnimationFrame(drawProgress);
    };
    const finePointer = matchMedia("(pointer: fine)");
    // La página puede llevar «zoom» en <html> (ver --zoom en styles.css): las
    // coordenadas del ratón se dividen por él para que el cursor no se desplace.
    const pageZoom = () =>
      parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    let zoom = pageZoom();
    const moveCursor = (event) => {
      if (!finePointer.matches) return;
      for (const element of [cursorRef.current, ringRef.current]) {
        if (element) {
          element.style.left = `${event.clientX / zoom}px`;
          element.style.top = `${event.clientY / zoom}px`;
        }
      }
    };
    const updateZoom = () => {
      zoom = pageZoom();
    };
    window.addEventListener("resize", updateZoom);
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    // La portada y sus fuentes pueden cambiar el diseño después del primer
    // cálculo. Recalcular evita conservar el color de la meteo en el inicio.
    const layoutObserver = new ResizeObserver(scheduleProgress);
    layoutObserver.observe(document.body);
    drawProgress();
    return () => {
      cancelAnimationFrame(frame);
      layoutObserver.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      window.removeEventListener("resize", updateZoom);
      window.removeEventListener("pointermove", moveCursor);
    };
  }, []);

  return { progressRef, cursorRef, ringRef };
}

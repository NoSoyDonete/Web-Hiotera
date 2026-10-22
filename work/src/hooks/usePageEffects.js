import { useEffect, useRef } from "react";

export function usePageEffects() {
  const progressRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const drawProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const scheduleProgress = () => {
      if (!frame) frame = requestAnimationFrame(drawProgress);
    };
    const finePointer = matchMedia("(pointer: fine)");
    const moveCursor = (event) => {
      if (!finePointer.matches) return;
      for (const element of [cursorRef.current, ringRef.current]) {
        if (element) {
          element.style.left = `${event.clientX}px`;
          element.style.top = `${event.clientY}px`;
        }
      }
    };
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    drawProgress();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      window.removeEventListener("pointermove", moveCursor);
    };
  }, []);

  return { progressRef, cursorRef, ringRef };
}

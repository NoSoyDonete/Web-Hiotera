import { useState } from "react";
import { heroPhases } from "../content.js";

export function heroTabTarget(key, index, count = heroPhases.length) {
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}

// La portada solo cambia al elegir una pestaña, nunca al desplazar la página.
export function useHeroPhases() {
  const [phase, setPhase] = useState(0);
  const onTabKeyDown = (event, index) => {
    const next = heroTabTarget(event.key, index);
    if (next === null) return;
    event.preventDefault();
    setPhase(next);
    event.currentTarget.parentElement
      .querySelector(`[data-hero-tab="${next}"]`)
      ?.focus();
  };
  return { phase, selectPhase: setPhase, onTabKeyDown };
}

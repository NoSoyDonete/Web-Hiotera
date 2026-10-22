const scrollKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

const fragmentId = (hash) => {
  try {
    return hash ? decodeURIComponent(hash.slice(1)) : "";
  } catch {
    return "";
  }
};

// React inserts fragment targets after the browser's initial navigation. Keep
// their position aligned through font/layout changes until the user takes over.
export function installHashNavigation({
  window = globalThis.window,
  document = globalThis.document,
} = {}) {
  if (!window || !document) return () => {};

  let disposed = false;
  let generation = 0;
  let frame = 0;
  let observer = null;
  let active = null;

  const stopRestoring = () => {
    generation += 1;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    observer?.disconnect();
    observer = null;
    active = null;
  };

  const schedule = (token) => {
    if (disposed || token !== generation || !active || frame) return;
    frame = window.requestAnimationFrame(() => {
      if (disposed || token !== generation || !active) return;
      frame = 0;
      const target = document.getElementById(active.id);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY;
      // ResizeObserver also fires when first attached. Do not interrupt a
      // smooth link navigation when the target's document position is stable.
      if (active.top === null || Math.abs(top - active.top) > 0.5) {
        const firstNavigation = active.top === null;
        const behavior = firstNavigation ? active.behavior : "instant";
        active.top = top;
        // Preserve native fragment navigation's keyboard starting point.
        if (firstNavigation) {
          if (!target.hasAttribute("tabindex"))
            target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
        target.scrollIntoView({ block: "start", behavior });
      }

      if (active.target === target) return;
      active.target = target;
      observer?.disconnect();
      const ResizeObserver = window.ResizeObserver;
      const main = document.querySelector("main");
      if (!ResizeObserver || !main) return;
      observer = new ResizeObserver(() => schedule(token));
      observer.observe(main);
      for (const section of main.children) {
        if (section === target || section.contains(target)) break;
        observer.observe(section);
      }
    });
  };

  const navigate = (hash, behavior = "instant") => {
    stopRestoring();
    const id = fragmentId(hash);
    if (disposed || !id) return;
    const token = generation;
    active = { id, behavior, top: null, target: null };
    schedule(token);
    if (document.fonts?.ready) {
      Promise.resolve(document.fonts.ready).then(
        () => schedule(token),
        () => {},
      );
    }
  };

  const hashChanged = () => navigate(window.location.hash);
  const clicked = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target?.closest?.("a[href]");
    if (!link || link.hasAttribute("target") || link.hasAttribute("download"))
      return;
    let url;
    try {
      url = new URL(link.getAttribute("href"), window.location.href);
    } catch {
      return;
    }
    const current = window.location;
    if (
      url.origin !== current.origin ||
      url.pathname !== current.pathname ||
      url.search !== current.search
    )
      return;
    const id = fragmentId(url.hash);
    if (!id || !document.getElementById(id)) return;

    event.preventDefault();
    if (url.hash !== current.hash) window.history.pushState(null, "", url.href);
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    navigate(url.hash, reduced ? "instant" : "smooth");
  };
  const keyPressed = (event) => {
    const target = event.target;
    if (
      event.defaultPrevented ||
      !scrollKeys.has(event.key) ||
      target?.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || "")
    )
      return;
    stopRestoring();
  };

  window.addEventListener("hashchange", hashChanged);
  window.addEventListener("wheel", stopRestoring, { passive: true });
  window.addEventListener("touchstart", stopRestoring, { passive: true });
  window.addEventListener("pointerdown", stopRestoring, { passive: true });
  window.addEventListener("keydown", keyPressed);
  document.addEventListener("click", clicked);
  hashChanged();

  return () => {
    disposed = true;
    stopRestoring();
    window.removeEventListener("hashchange", hashChanged);
    window.removeEventListener("wheel", stopRestoring);
    window.removeEventListener("touchstart", stopRestoring);
    window.removeEventListener("pointerdown", stopRestoring);
    window.removeEventListener("keydown", keyPressed);
    document.removeEventListener("click", clicked);
  };
}

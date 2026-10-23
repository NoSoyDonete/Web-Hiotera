// El tiempo global del visor nunca se usa para el despiece: reiniciaría el viento.
export function createMeteoPlayback(
  model,
  shouldPlay,
  requestFrame = requestAnimationFrame,
  cancelFrame = cancelAnimationFrame,
) {
  let pauseFrame = 0;
  let disposed = false;
  const sync = (seeking = false) => {
    cancelFrame(pauseFrame);
    pauseFrame = 0;
    if (disposed) return;
    const playing = shouldPlay();
    model.timeScale = playing ? 1 : 0;
    if (playing) {
      if (model.paused) model.play?.();
    } else if (!seeking) {
      model.pause?.();
    } else {
      // appendAnimation actualiza la pose en el siguiente render. Con tiempo 0
      // se permite ese render incluso en pausa, sin mover viento ni gotas.
      pauseFrame = requestFrame(() => {
        pauseFrame = requestFrame(() => {
          pauseFrame = 0;
          if (!disposed && !shouldPlay()) model.pause?.();
        });
      });
    }
  };
  return {
    sync,
    dispose() {
      disposed = true;
      cancelFrame(pauseFrame);
      model.pause?.();
    },
  };
}

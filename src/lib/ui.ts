import type { Stage } from "./stage";

/** Wire a pause button (and the Space key when the canvas is focused) to a stage. */
export function bindPauseControls(stage: Stage, button: HTMLButtonElement, canvas: HTMLCanvasElement): void {
  stage.subscribePause((paused) => {
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Play animation" : "Pause animation";
  });
  canvas.tabIndex = 0;
  button.addEventListener("click", () => stage.togglePaused());
  canvas.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      stage.togglePaused();
    }
  });
}

export function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

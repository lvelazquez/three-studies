import * as THREE from "three";
import {
  COLOR_BACKGROUND,
  MAX_FRAME_DT,
  MAX_PIXEL_RATIO,
  REDUCED_MOTION_QUERY,
} from "./constants";

export interface StageContent {
  /** Called every rendered frame while running; `dt` is seconds since the last frame. */
  update?(dt: number): void;
  dispose?(): void;
}

export interface StageOptions {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  content?: StageContent;
  /** Text alternative announced for the canvas. */
  label: string;
}

/**
 * Owns the renderer, resize handling, pause state and teardown for a study.
 * Honors prefers-reduced-motion by starting paused; paused stages still
 * re-render on demand (resize, `requestRender()`).
 */
export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly content?: StageContent;
  private readonly resizeObserver: ResizeObserver;
  private readonly motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  private lastTime: number | null = null;
  private rafId: number | null = null;
  private paused: boolean;
  private disposed = false;
  private onPauseChange: (paused: boolean) => void = () => {};

  constructor(opts: StageOptions) {
    this.canvas = opts.canvas;
    this.scene = opts.scene;
    this.camera = opts.camera;
    this.content = opts.content;

    this.canvas.setAttribute("role", "img");
    this.canvas.setAttribute("aria-label", opts.label);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.scene.background = new THREE.Color(COLOR_BACKGROUND);

    this.paused = this.motionQuery.matches;
    this.motionQuery.addEventListener("change", this.onMotionPreference);

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.canvas);
    this.resize();
    this.requestRender();
  }

  get isPaused(): boolean {
    return this.paused;
  }

  /** Register a listener (fires immediately with the current state). */
  subscribePause(cb: (paused: boolean) => void): void {
    this.onPauseChange = cb;
    cb(this.paused);
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    this.lastTime = null;
    this.onPauseChange(paused);
    this.requestRender();
  }

  togglePaused(): void {
    this.setPaused(!this.paused);
  }

  /** Schedule a frame; the loop keeps itself going only while unpaused. */
  requestRender = (): void => {
    if (this.disposed || this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.frame);
  };

  dispose(): void {
    this.disposed = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.motionQuery.removeEventListener("change", this.onMotionPreference);
    this.content?.dispose?.();
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    this.renderer.dispose();
  }

  private onMotionPreference = (e: MediaQueryListEvent): void => {
    if (e.matches) this.setPaused(true);
  };

  private resize = (): void => {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width === 0 || height === 0) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.requestRender();
  };

  private frame = (): void => {
    this.rafId = null;
    if (this.disposed) return;
    if (!this.paused) {
      const now = performance.now();
      const dt = this.lastTime === null ? 0 : (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.content?.update?.(Math.min(dt, MAX_FRAME_DT));
    }
    this.renderer.render(this.scene, this.camera);
    if (!this.paused) this.requestRender();
  };
}

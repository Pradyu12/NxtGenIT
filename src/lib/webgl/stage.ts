import { createContext, createProgram, resolveUniforms, FULLSCREEN_TRIANGLE, type GL } from './gl';

export type StageFrame = {
  gl: GL;
  u: Record<string, WebGLUniformLocation | null>;
  /** CSS pixel size of the canvas. */
  width: number;
  height: number;
  devicePixelRatio: number;
  /** Seconds since the stage started. */
  time: number;
  /** Seconds since the previous frame, clamped to avoid post-tab-switch jumps. */
  dt: number;
  /** Raw pointer, normalised to -1..1 across the viewport, y up. Null on touch. */
  pointer: { x: number; y: number } | null;
};

export type StageOptions = {
  fragment: string;
  /** Upper bound on device pixel ratio. 1.5 keeps fill-rate sane on retina. */
  dprCap?: number;
  /** Extra resolution multiplier, lowered automatically if frames get expensive. */
  renderScale?: number;
  /** Track the pointer across the viewport (desktop only). */
  interactive?: boolean;
  /** Cross-fade the scene in on first paint. */
  intro?: boolean;
  /** Render one frame and hold it. Used for prefers-reduced-motion. */
  still?: boolean;
  onFrame: (frame: StageFrame) => void;
};

export type Stage = {
  supported: boolean;
  /** Current backing-store multiplier, after any automatic quality downgrade. */
  readonly quality: number;
  destroy: () => void;
};

/** Frames slower than this (ms) suggest the GPU is struggling; drop resolution once. */
const SLOW_FRAME_MS = 26;
const SLOW_FRAME_BUDGET = 90;

/**
 * Creates a render loop for a single full-bleed fragment shader.
 *
 * Handles everything expensive and repetitive so scene files stay declarative:
 * context creation, program setup, DPR-capped sizing, adaptive quality, the
 * rAF loop, pointer tracking, and pausing when off-screen or backgrounded.
 */
export function createStage(canvas: HTMLCanvasElement, options: StageOptions): Stage {
  const {
    fragment,
    dprCap = 1.5,
    renderScale = 1,
    interactive = true,
    intro = true,
    still = false,
    onFrame,
  } = options;

  const gl = createContext(canvas);
  if (!gl) return { supported: false, quality: 0, destroy: () => {} };

  const program = createProgram(gl, fragment);
  if (!program) return { supported: false, quality: 0, destroy: () => {} };

  const uniforms = resolveUniforms(gl, program);
  const buffer = gl.createBuffer();

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);

  let quality = renderScale;
  let cssWidth = 0;
  let cssHeight = 0;
  let devicePixelRatio = 1;
  let frameHandle = 0;
  let startTime = 0;
  let lastTime = 0;
  let disposed = false;

  // Pause when off-screen or on a background tab — a fullscreen fragment shader
  // should never burn battery for pixels nobody is looking at.
  let onScreen = true;
  let tabVisible = true;
  let slowFrames = 0;
  let introDone = !intro;

  const pointer = { x: 0, y: 0 };
  let pointerSeen = false;
  let hasPointer = false;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, dprCap) * quality;

    if (nextWidth === cssWidth && nextHeight === cssHeight && nextDpr === devicePixelRatio) return;

    cssWidth = nextWidth;
    cssHeight = nextHeight;
    devicePixelRatio = nextDpr;
    canvas.width = Math.round(nextWidth * nextDpr);
    canvas.height = Math.round(nextHeight * nextDpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  /** Draws one frame and returns the elapsed scene time in seconds. */
  const render = (now: number): number => {
    if (!startTime) {
      startTime = now;
      lastTime = now;
    }

    const time = (now - startTime) / 1000;
    const rawDelta = now - lastTime;
    lastTime = now;
    // A backgrounded tab can hand us a multi-second delta; ignore it.
    const dt = Math.min(rawDelta, 64) / 1000;

    resize();

    // One-shot quality downgrade rather than a continuous resolution hunt.
    if (quality > 0.6 && rawDelta > SLOW_FRAME_MS && rawDelta < 200) {
      slowFrames += 1;
      if (slowFrames > SLOW_FRAME_BUDGET) {
        quality = 0.6;
        slowFrames = 0;
        resize();
      }
    } else if (rawDelta <= SLOW_FRAME_MS) {
      slowFrames = Math.max(0, slowFrames - 2);
    }

    gl.uniform2f(uniforms.u_pointer ?? null, pointerSeen ? pointer.x : 0, pointerSeen ? pointer.y : 0);
    gl.uniform2f(uniforms.u_res ?? null, canvas.width, canvas.height);
    gl.uniform1f(uniforms.u_time ?? null, time);
    gl.uniform1f(uniforms.u_intro ?? null, introDone ? 1 : Math.min(1, time / 1.6));

    onFrame({
      gl,
      u: uniforms,
      width: cssWidth,
      height: cssHeight,
      devicePixelRatio,
      time,
      dt,
      pointer: hasPointer ? pointer : null,
    });

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return time;
  };

  const draw = (now: number) => {
    if (disposed) return;

    const time = render(now);
    if (!introDone && time > 1.7) introDone = true;

    frameHandle = requestAnimationFrame(draw);
  };

  const start = () => {
    if (disposed || frameHandle) return;

    if (still) {
      // Settled frame at full intensity, then never again.
      introDone = true;
      resize();
      render(performance.now());
      return;
    }

    frameHandle = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (!frameHandle) return;
    cancelAnimationFrame(frameHandle);
    frameHandle = 0;
  };

  const onVisibility = () => {
    tabVisible = document.visibilityState === 'visible';
    if (tabVisible && onScreen) start();
    else stop();
  };

  const intersection = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      if (onScreen && tabVisible) start();
      else stop();
    },
    { threshold: 0 },
  );
  intersection.observe(canvas);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  let onPointerMove: ((event: PointerEvent) => void) | null = null;
  if (interactive && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointerSeen = true;
      hasPointer = true;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  document.addEventListener('visibilitychange', onVisibility);
  resize();
  start();

  return {
    supported: true,
    get quality() {
      return quality;
    },
    destroy() {
      disposed = true;
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

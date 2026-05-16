import { shouldRunHeroShader } from "./deviceProfile";
import { getActiveSpaSlide, onSpaSlideChange } from "./spaSlideEvents";

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

const VERTICES = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

type ProgramLocs = {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  move: WebGLUniformLocation | null;
  touch: WebGLUniformLocation | null;
  pointerCount: WebGLUniformLocation | null;
  pointers: WebGLUniformLocation | null;
};

class WebGLRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private locs: ProgramLocs = {
    resolution: null,
    time: null,
    move: null,
    touch: null,
    pointerCount: null,
    pointers: null,
  };
  private scale = 1;
  private mouseMove: [number, number] = [0, 0];
  private mouseCoords: [number, number] = [0, 0];
  private pointerCoords: number[] = [0, 0];
  private nbrOfPointers = 0;
  private shaderSource: string;

  constructor(
    private canvas: HTMLCanvasElement,
    scale: number,
    shaderSource: string
  ) {
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) throw new Error("WebGL2 não disponível");
    this.gl = gl;
    this.scale = scale;
    this.shaderSource = shaderSource;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  updateMove(deltas: [number, number]) {
    this.mouseMove = deltas;
  }

  updateMouse(coords: [number, number]) {
    this.mouseCoords = coords;
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr;
  }

  private compile(type: number, source: string) {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  reset() {
    const gl = this.gl;
    if (this.program) {
      if (this.vs) gl.deleteShader(this.vs);
      if (this.fs) gl.deleteShader(this.fs);
      gl.deleteProgram(this.program);
    }
    this.program = null;
    this.vs = null;
    this.fs = null;
  }

  setup() {
    this.reset();
    const gl = this.gl;
    this.vs = this.compile(gl.VERTEX_SHADER, VERTEX_SRC);
    this.fs = this.compile(gl.FRAGMENT_SHADER, this.shaderSource);
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }
  }

  init() {
    const gl = this.gl;
    const program = this.program!;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.locs = {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      move: gl.getUniformLocation(program, "move"),
      touch: gl.getUniformLocation(program, "touch"),
      pointerCount: gl.getUniformLocation(program, "pointerCount"),
      pointers: gl.getUniformLocation(program, "pointers"),
    };
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;
    if (!program) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.uniform2f(this.locs.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.locs.time, now * 1e-3);
    gl.uniform2f(this.locs.move, this.mouseMove[0], this.mouseMove[1]);
    gl.uniform2f(this.locs.touch, this.mouseCoords[0], this.mouseCoords[1]);
    gl.uniform1i(this.locs.pointerCount, this.nbrOfPointers);
    gl.uniform2fv(this.locs.pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  private active = false;
  private pointers = new Map<number, [number, number]>();
  private lastCoords: [number, number] = [0, 0];
  private moves: [number, number] = [0, 0];

  constructor(
    private canvas: HTMLCanvasElement,
    private getSize: () => { width: number; height: number }
  ) {
    const map = (clientX: number, clientY: number): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      const { width, height } = getSize();
      const sx = width / rect.width;
      const sy = height / rect.height;
      return [(clientX - rect.left) * sx, height - (clientY - rect.top) * sy];
    };

    canvas.addEventListener("pointerdown", (e) => {
      this.active = true;
      this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
    });

    const up = (e: PointerEvent) => {
      if (this.pointers.size === 1) {
        const c = this.pointers.values().next().value;
        if (c) this.lastCoords = c;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    };

    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);
    canvas.addEventListener("pointercancel", up);

    canvas.addEventListener("pointermove", (e) => {
      if (!this.active) return;
      this.lastCoords = map(e.clientX, e.clientY);
      this.pointers.set(e.pointerId, this.lastCoords);
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
    });

    canvas.addEventListener(
      "mousemove",
      (e) => {
        this.lastCoords = map(e.clientX, e.clientY);
        if (!this.active) this.pointers.set(0, this.lastCoords);
      },
      { passive: true }
    );
  }

  get count() {
    return Math.max(this.pointers.size, 1);
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [...this.lastCoords];
  }

  get first(): [number, number] {
    const v = this.pointers.values().next().value;
    return v ?? this.lastCoords;
  }
}

let raf = 0;
let renderer: WebGLRenderer | null = null;
let pointers: PointerHandler | null = null;
let resizeObserver: ResizeObserver | null = null;
let loopActive = false;
let unsubSlide: (() => void) | null = null;

function measure(canvas: HTMLCanvasElement, host: HTMLElement) {
  const rect = host.getBoundingClientRect();
  const dpr = Math.min(Math.max(1, window.devicePixelRatio * 0.65), 1.5);
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  return { w, h, dpr };
}

function destroyHeroShader() {
  cancelAnimationFrame(raf);
  raf = 0;
  loopActive = false;
  unsubSlide?.();
  unsubSlide = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
  renderer?.reset();
  renderer = null;
  pointers = null;
  delete window.__solutionPlayHeroShaderDestroy;
}

function loop(now: number) {
  if (!loopActive || !renderer || !pointers) return;
  renderer.updateMouse(pointers.first);
  renderer.updatePointerCount(pointers.count);
  renderer.updatePointerCoords(pointers.coords);
  renderer.updateMove(pointers.move);
  renderer.render(now);
  raf = requestAnimationFrame(loop);
}

function setHeroLoop(active: boolean) {
  loopActive = active;
  if (active) {
    if (renderer && pointers && !raf) raf = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

async function initHeroShader() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyHeroShader();
    return;
  }

  const host = document.querySelector<HTMLElement>("[data-hero-shader-host]");
  host?.classList.toggle("hero-shader-host--static", !shouldRunHeroShader());

  if (!shouldRunHeroShader()) {
    destroyHeroShader();
    return;
  }
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-shader-canvas]");
  if (!host || !canvas) return;

  destroyHeroShader();

  try {
    const { heroShaderSource } = await import("../data/heroShaderSource");
    const { w, h, dpr } = measure(canvas, host);
    renderer = new WebGLRenderer(canvas, dpr, heroShaderSource);
    renderer.resize(w, h);
    renderer.setup();
    renderer.init();
    pointers = new PointerHandler(canvas, () => ({
      width: canvas.width,
      height: canvas.height,
    }));

    const onResize = () => {
      if (!renderer) return;
      const m = measure(canvas, host);
      renderer.resize(m.w, m.h);
      renderer.updateScale(m.dpr);
    };

    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);
    onResize();

    unsubSlide = onSpaSlideChange((id) => {
      setHeroLoop(id === "hero");
    });
    setHeroLoop(getActiveSpaSlide() === "hero");

    window.__solutionPlayHeroShaderDestroy = destroyHeroShader;
  } catch (err) {
    console.warn("Hero shader desativado:", err);
  }
}

declare global {
  interface Window {
    __solutionPlayHeroShaderDestroy?: () => void;
  }
}

function scheduleHeroShaderInit() {
  const run = () => void initHeroShader();
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 1800 });
  } else {
    requestAnimationFrame(run);
  }
}

void scheduleHeroShaderInit();
document.addEventListener("astro:page-load", scheduleHeroShaderInit);

import { neuralParticleCount, prefersReducedMotion } from "./deviceProfile";
import { getActiveSpaSlide, onSpaSlideChange, type SpaSlideId } from "./spaSlideEvents";
import { runAfterNextPaint } from "./scheduleFrame";

const TRAIL_OPACITY = 0.14;
const SPEED = 1;

type HostState = {
  slideId: SpaSlideId;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: ParticleInst[];
  width: number;
  height: number;
  mouse: { x: number; y: number };
  color: string;
};

type ParticleInst = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  update: () => void;
  reset: () => void;
  draw: (ctx: CanvasRenderingContext2D, color: string) => void;
};

const hosts = new Map<HTMLElement, HostState>();
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let unsubSlide: (() => void) | null = null;

function animationNeeded() {
  const slide = getActiveSpaSlide();
  for (const state of hosts.values()) {
    if (state.slideId === slide) return true;
  }
  return false;
}

function ensureAnimateLoop() {
  if (raf || !hosts.size) return;
  raf = requestAnimationFrame(animate);
}

function isActive(state: HostState) {
  return getActiveSpaSlide() === state.slideId;
}

function createParticle(state: HostState): ParticleInst {
  const p = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    age: 0,
    life: 0,
    update() {},
    reset() {},
    draw() {},
  };

  p.reset = function () {
    p.x = Math.random() * state.width;
    p.y = Math.random() * state.height;
    p.vx = 0;
    p.vy = 0;
    p.age = 0;
    p.life = Math.random() * 200 + 100;
  };

  p.update = function () {
    const angle = (Math.cos(p.x * 0.005) + Math.sin(p.y * 0.005)) * Math.PI;
    p.vx += Math.cos(angle) * 0.2 * SPEED;
    p.vy += Math.sin(angle) * 0.2 * SPEED;

    const dx = state.mouse.x - p.x;
    const dy = state.mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      const force = (150 - dist) / 150;
      p.vx -= dx * force * 0.05;
      p.vy -= dy * force * 0.05;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.age++;
    if (p.age > p.life) p.reset();
    if (p.x < 0) p.x = state.width;
    if (p.x > state.width) p.x = 0;
    if (p.y < 0) p.y = state.height;
    if (p.y > state.height) p.y = 0;
  };

  p.draw = function (ctx, color) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 1 - Math.abs(p.age / p.life - 0.5) * 2;
    ctx.fillRect(p.x, p.y, 2, 2);
  };

  p.reset();
  return p;
}

function resizeHost(state: HostState) {
  state.width = Math.max(1, state.container.clientWidth);
  state.height = Math.max(1, state.container.clientHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.canvas.width = state.width * dpr;
  state.canvas.height = state.height * dpr;
  state.ctx.setTransform(1, 0, 0, 1, 0, 0);
  state.ctx.scale(dpr, dpr);
  state.canvas.style.width = `${state.width}px`;
  state.canvas.style.height = `${state.height}px`;
  state.particles = [];
  const count = neuralParticleCount();
  for (let i = 0; i < count; i++) {
    state.particles.push(createParticle(state));
  }
}

function wakeSlide(slideId: SpaSlideId) {
  hosts.forEach((state) => {
    if (state.slideId === slideId) resizeHost(state);
  });
}

function animate() {
  raf = 0;
  if (!animationNeeded()) return;

  hosts.forEach((state) => {
    if (!isActive(state)) return;

    const { ctx, width, height, particles, color } = state;
    ctx.fillStyle = `rgba(3, 3, 8, ${TRAIL_OPACITY})`;
    ctx.fillRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw(ctx, color);
    });
    ctx.globalAlpha = 1;
  });

  raf = requestAnimationFrame(animate);
}

function destroyNeuralBackdrop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  resizeObserver?.disconnect();
  resizeObserver = null;
  unsubSlide?.();
  unsubSlide = null;
  hosts.clear();
  delete window.__solutionPlayNeuralDestroy;
}

function initNeuralBackdrop() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyNeuralBackdrop();
    return;
  }

  if (prefersReducedMotion() || neuralParticleCount() === 0) return;

  destroyNeuralBackdrop();

  document.querySelectorAll<HTMLElement>("[data-neural-backdrop]").forEach((container) => {
    const slideId = container.dataset.neuralSlide as SpaSlideId | undefined;
    if (!slideId) return;

    const canvas = container.querySelector<HTMLCanvasElement>("[data-neural-canvas]");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const color = container.dataset.neuralColor || "#5eead4";
    const state: HostState = {
      slideId,
      container,
      canvas,
      ctx,
      particles: [],
      width: 0,
      height: 0,
      mouse: { x: -1000, y: -1000 },
      color,
    };

    resizeHost(state);
    hosts.set(container, state);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      state.mouse.x = -1000;
      state.mouse.y = -1000;
    };
    container.addEventListener("mousemove", onMouseMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave);
  });

  if (!hosts.size) return;

  resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const state = hosts.get(entry.target as HTMLElement);
      if (state) resizeHost(state);
    });
  });
  hosts.forEach((state) => resizeObserver!.observe(state.container));

  unsubSlide = onSpaSlideChange((slideId) => {
    requestAnimationFrame(() => wakeSlide(slideId));
    ensureAnimateLoop();
  });

  wakeSlide(getActiveSpaSlide());
  ensureAnimateLoop();
  window.__solutionPlayNeuralDestroy = destroyNeuralBackdrop;
}

declare global {
  interface Window {
    __solutionPlayNeuralDestroy?: () => void;
  }
}

void runAfterNextPaint(initNeuralBackdrop);
document.addEventListener("astro:page-load", () => runAfterNextPaint(initNeuralBackdrop));

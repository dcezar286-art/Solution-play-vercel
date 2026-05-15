const COLOR = "#5eead4";
const TRAIL_OPACITY = 0.12;
const PARTICLE_COUNT = 600;
const SPEED = 1;

type ParticleInst = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  update: () => void;
  reset: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

let raf = 0;
let running = false;
let resizeObserver: ResizeObserver | null = null;
let slideObserver: MutationObserver | null = null;
let cleanupListeners: (() => void) | null = null;

function isServicesSlide() {
  return document.documentElement.dataset.spaSlide === "services";
}

function destroyServicesNeural() {
  cancelAnimationFrame(raf);
  raf = 0;
  running = false;
  resizeObserver?.disconnect();
  resizeObserver = null;
  slideObserver?.disconnect();
  slideObserver = null;
  cleanupListeners?.();
  cleanupListeners = null;
  delete window.__solutionPlayServicesNeuralDestroy;
}

function initServicesNeural() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyServicesNeural();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const container = document.querySelector<HTMLElement>("[data-services-neural-host]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-services-neural-canvas]");
  if (!container || !canvas) return;

  destroyServicesNeural();

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = container.clientWidth;
  let height = container.clientHeight;
  let particles: ParticleInst[] = [];
  let mouse = { x: -1000, y: -1000 };

  function createParticle(): ParticleInst {
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
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.vx = 0;
      p.vy = 0;
      p.age = 0;
      p.life = Math.random() * 200 + 100;
    };

    p.update = function () {
      const angle = (Math.cos(p.x * 0.005) + Math.sin(p.y * 0.005)) * Math.PI;
      p.vx += Math.cos(angle) * 0.2 * SPEED;
      p.vy += Math.sin(angle) * 0.2 * SPEED;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactionRadius = 150;

      if (distance < interactionRadius) {
        const force = (interactionRadius - distance) / interactionRadius;
        p.vx -= dx * force * 0.05;
        p.vy -= dy * force * 0.05;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.age++;

      if (p.age > p.life) p.reset();

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    };

    p.draw = function (context: CanvasRenderingContext2D) {
      context.fillStyle = COLOR;
      const alpha = 1 - Math.abs(p.age / p.life - 0.5) * 2;
      context.globalAlpha = alpha;
      context.fillRect(p.x, p.y, 1.5, 1.5);
    };

    p.reset();
    return p;
  }

  const initCanvas = () => {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  };

  const animate = () => {
    if (!running) {
      raf = requestAnimationFrame(animate);
      return;
    }

    ctx.fillStyle = `rgba(3, 3, 8, ${TRAIL_OPACITY})`;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(animate);
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  const onMouseLeave = () => {
    mouse.x = -1000;
    mouse.y = -1000;
  };

  initCanvas();
  running = isServicesSlide();
  raf = requestAnimationFrame(animate);

  resizeObserver = new ResizeObserver(initCanvas);
  resizeObserver.observe(container);

  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseleave", onMouseLeave);

  slideObserver = new MutationObserver(() => {
    running = isServicesSlide();
  });
  slideObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-spa-slide"],
  });

  cleanupListeners = () => {
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseleave", onMouseLeave);
  };

  window.__solutionPlayServicesNeuralDestroy = destroyServicesNeural;
}

declare global {
  interface Window {
    __solutionPlayServicesNeuralDestroy?: () => void;
  }
}

void initServicesNeural();
document.addEventListener("astro:page-load", initServicesNeural);

declare global {
  interface Window {
    __solutionPlayEntropyDestroy?: () => void;
  }
}

let activeDispose: (() => void) | undefined;

type ParticleInst = {
  x: number;
  y: number;
  size: number;
  order: boolean;
  velocity: { x: number; y: number };
  originalX: number;
  originalY: number;
  influence: number;
  neighbors: ParticleInst[];
  update: (w: number, h: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

function startEntropy(canvas: HTMLCanvasElement) {
  activeDispose?.();

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let disposed = false;
  let animationId = 0;
  let time = 0;
  let particles: ParticleInst[] = [];
  let w = 0;
  let h = 0;

  const particleColor = "#5eead4";

  class Particle implements ParticleInst {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    size = 2;
    order: boolean;
    velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
    influence = 0;
    neighbors: ParticleInst[] = [];

    constructor(x: number, y: number, order: boolean) {
      this.x = x;
      this.y = y;
      this.originalX = x;
      this.originalY = y;
      this.order = order;
    }

    update(cw: number, ch: number) {
      if (this.order) {
        const dx = this.originalX - this.x;
        const dy = this.originalY - this.y;
        let chaosX = 0;
        let chaosY = 0;
        this.neighbors.forEach((neighbor) => {
          if (!neighbor.order) {
            const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y);
            const strength = Math.max(0, 1 - distance / 100);
            chaosX += neighbor.velocity.x * strength;
            chaosY += neighbor.velocity.y * strength;
            this.influence = Math.max(this.influence, strength);
          }
        });
        this.x += dx * 0.05 * (1 - this.influence) + chaosX * this.influence;
        this.y += dy * 0.05 * (1 - this.influence) + chaosY * this.influence;
        this.influence *= 0.99;
      } else {
        this.velocity.x += (Math.random() - 0.5) * 0.5;
        this.velocity.y += (Math.random() - 0.5) * 0.5;
        this.velocity.x *= 0.95;
        this.velocity.y *= 0.95;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x < cw * 0.5 || this.x > cw) this.velocity.x *= -1;
        if (this.y < 0 || this.y > ch) this.velocity.y *= -1;
        this.x = Math.max(cw * 0.5, Math.min(cw, this.x));
        this.y = Math.max(0, Math.min(ch, this.y));
      }
    }

    draw(context: CanvasRenderingContext2D) {
      const alpha = this.order ? 0.55 - this.influence * 0.35 : 0.45;
      const hex = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0");
      context.fillStyle = `${particleColor}${hex}`;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  function buildParticles(cw: number, ch: number) {
    particles = [];
    const gridSize = 25;
    const spacingX = cw / gridSize;
    const spacingY = ch / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = spacingX * i + spacingX / 2;
        const y = spacingY * j + spacingY / 2;
        const order = x < cw * 0.5;
        particles.push(new Particle(x, y, order));
      }
    }
  }

  function updateNeighbors() {
    particles.forEach((p) => {
      p.neighbors = particles.filter((o) => o !== p && Math.hypot(p.x - o.x, p.y - o.y) < 100);
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles(w, h);
    if (reduce) drawFrame();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);
    if (time % 30 === 0) updateNeighbors();
    particles.forEach((p) => {
      p.update(w, h);
      p.draw(ctx);
      p.neighbors.forEach((n) => {
        const d = Math.hypot(p.x - n.x, p.y - n.y);
        if (d < 50) {
          const a = 0.12 * (1 - d / 50);
          const hex = Math.round(a * 255)
            .toString(16)
            .padStart(2, "0");
          ctx.strokeStyle = `${particleColor}${hex}`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      });
    });
    time++;
  }

  function animate() {
    if (disposed) return;
    drawFrame();
    animationId = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);

  if (!reduce) animate();
  else drawFrame();

  activeDispose = () => {
    disposed = true;
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
  };
}

export function initEntropyBackdrop() {
  if (!document.documentElement.classList.contains("home-spa")) {
    activeDispose?.();
    activeDispose = undefined;
    return;
  }

  const canvas = document.getElementById("entropy-backdrop");
  if (canvas instanceof HTMLCanvasElement) startEntropy(canvas);
}

export function destroyEntropyBackdrop() {
  activeDispose?.();
  activeDispose = undefined;
}

window.__solutionPlayEntropyDestroy = destroyEntropyBackdrop;

void initEntropyBackdrop();
document.addEventListener("astro:page-load", initEntropyBackdrop);

let activeDispose: (() => void) | undefined;

function destroy() {
  activeDispose?.();
  activeDispose = undefined;
}

type Node = { nx: number; ny: number; phase: number };

function start() {
  destroy();
  const canvas = document.getElementById("network-backdrop");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let disposed = false;
  let raf = 0;
  let t = 0;

  const nodes: Node[] = Array.from({ length: 52 }, () => ({
    nx: Math.random(),
    ny: Math.random(),
    phase: Math.random() * Math.PI * 2,
  }));

  let mx = window.innerWidth * 0.5;
  let my = window.innerHeight * 0.45;

  const onMouse = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
    if (reduce) drawFrame();
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) drawFrame();
  };

  const px = (n: Node, w: number, h: number, driftX: number, driftY: number) => n.nx * w + driftX * 0.35;
  const py = (n: Node, w: number, h: number, driftX: number, driftY: number) => n.ny * h + driftY * 0.35;

  function drawFrame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const driftX = ((mx / w) * 2 - 1) * 10;
    const driftY = ((my / h) * 2 - 1) * 8;

    ctx.save();
    ctx.strokeStyle = "rgba(94, 234, 212, 0.045)";
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = (driftX % step) - step; x < w + step; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = (driftY % step) - step; y < h + step; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const xi = px(nodes[i], w, h, driftX, driftY);
        const yi = py(nodes[i], w, h, driftX, driftY);
        const xj = px(nodes[j], w, h, driftX, driftY);
        const yj = py(nodes[j], w, h, driftX, driftY);
        const d = Math.hypot(xi - xj, yi - yj);
        if (d < 130 && d > 0) {
          const a = (1 - d / 130) * 0.12;
          ctx.strokeStyle = `rgba(94, 234, 212, ${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xi, yi);
          ctx.lineTo(xj, yj);
          ctx.stroke();
        }
      }
    }

    const linkR = 240;
    for (const n of nodes) {
      const x = px(n, w, h, driftX, driftY);
      const y = py(n, w, h, driftX, driftY);
      const dx = mx - x;
      const dy = my - y;
      const d = Math.hypot(dx, dy);
      if (d < linkR && d > 4) {
        const a = (1 - d / linkR) * 0.42;
        const g = ctx.createLinearGradient(x, y, mx, my);
        g.addColorStop(0, `rgba(94, 234, 212, ${a * 0.35})`);
        g.addColorStop(0.5, `rgba(34, 211, 238, ${a * 0.55})`);
        g.addColorStop(1, `rgba(165, 180, 252, ${a * 0.25})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(mx, my);
        ctx.stroke();

        if (!reduce) {
          const u = (t * 0.0012 + n.phase) % 1;
          const px2 = x + dx * u;
          const py2 = y + dy * u;
          ctx.fillStyle = `rgba(226, 232, 240, ${a * 0.55})`;
          ctx.beginPath();
          ctx.arc(px2, py2, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (const n of nodes) {
      const x = px(n, w, h, driftX, driftY);
      const y = py(n, w, h, driftX, driftY);
      const d = Math.hypot(mx - x, my - y);
      const pulse = reduce ? 0.28 : 0.22 + 0.12 * Math.sin(t * 0.004 + n.phase);
      const a = d < linkR ? pulse + (1 - d / linkR) * 0.25 : pulse * 0.45;
      ctx.fillStyle = `rgba(148, 196, 255, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const loop = () => {
    if (disposed) return;
    t += 16;
    drawFrame();
    raf = requestAnimationFrame(loop);
  };

  window.addEventListener("mousemove", onMouse, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  resize();
  if (!reduce) {
    raf = requestAnimationFrame(loop);
  } else {
    drawFrame();
  }

  activeDispose = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMouse);
    window.removeEventListener("resize", resize);
  };
}

void start();
document.addEventListener("astro:page-load", () => {
  void start();
});

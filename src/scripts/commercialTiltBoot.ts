/** Inclinação 3D suave nos cartões de Contratos (CSS + pointer, sem React). */

import { runAfterNextPaint } from "./scheduleFrame";
const MAX_DEG = 5;

const cleanups: Array<() => void> = [];

function attach(el: HTMLElement) {
  const passiveOpts = { passive: true } as const;

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    const rx = -(y / r.height) * MAX_DEG;
    const ry = (x / r.width) * MAX_DEG;
    el.style.setProperty("--tilt-rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--tilt-ry", `${ry.toFixed(2)}deg`);
    el.classList.add("is-tilting");
  };

  const onLeave = () => {
    el.style.removeProperty("--tilt-rx");
    el.style.removeProperty("--tilt-ry");
    el.classList.remove("is-tilting");
  };

  el.addEventListener("pointermove", onMove, passiveOpts);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("pointerdown", onMove, passiveOpts);

  return () => {
    el.removeEventListener("pointermove", onMove, passiveOpts);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("pointerdown", onMove, passiveOpts);
  };
}

function clearTilts() {
  while (cleanups.length) cleanups.pop()?.();
}

function bindAllTilts() {
  clearTilts();
  document.querySelectorAll<HTMLElement>("[data-tilt-card]").forEach((el) => {
    cleanups.push(attach(el));
  });
}

function initCommercialTilt() {
  if (!document.documentElement.classList.contains("home-spa")) {
    clearTilts();
    return;
  }
  bindAllTilts();
}

void runAfterNextPaint(initCommercialTilt);
document.addEventListener("astro:page-load", () => runAfterNextPaint(initCommercialTilt));
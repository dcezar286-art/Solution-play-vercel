/** Text scramble no hover/foco — título Serviços (sem React). */

import { runAfterNextPaint } from "./scheduleFrame";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

function renderScrambleChars(
  host: HTMLElement,
  display: string,
  target: string,
  scrambling: boolean
) {
  host.replaceChildren();
  for (let i = 0; i < display.length; i++) {
    const ch = display[i]!;
    const tch = target[i];
    const span = document.createElement("span");
    span.className = "text-scramble__char";
    span.textContent = ch === " " ? "\u00a0" : ch;
    if (scrambling && tch !== " " && ch !== tch) span.classList.add("text-scramble__char--mut");
    host.appendChild(span);
  }
}

function bindTextScramble(el: HTMLElement) {
  if (el.dataset.scrambleBound === "1") return;
  const full = (el.dataset.scrambleText ?? el.textContent ?? "").trim();
  if (!full) return;
  el.dataset.scrambleBound = "1";
  el.dataset.scrambleText = full;
  el.textContent = full;

  let interval: ReturnType<typeof setInterval> | null = null;

  const clear = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const scramble = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    clear();
    let frame = 0;
    const duration = Math.max(12, full.length * 3);

    interval = setInterval(() => {
      frame += 1;
      const progress = frame / duration;
      const revealed = Math.floor(progress * full.length);
      let outStr = "";
      for (let i = 0; i < full.length; i++) {
        const c = full[i]!;
        if (c === " ") outStr += " ";
        else if (i < revealed) outStr += c;
        else outStr += CHARS[Math.floor(Math.random() * CHARS.length)]!;
      }
      renderScrambleChars(el, outStr, full, true);

      if (frame >= duration) {
        clear();
        el.textContent = full;
      }
    }, 30);
  };

  el.addEventListener("pointerenter", scramble);
  el.addEventListener("focus", scramble);
}

function initTextScramble() {
  if (!document.documentElement.classList.contains("home-spa")) return;
  document.querySelectorAll<HTMLElement>("[data-text-scramble]").forEach(bindTextScramble);
}

void runAfterNextPaint(initTextScramble);
document.addEventListener("astro:page-load", () => runAfterNextPaint(initTextScramble));

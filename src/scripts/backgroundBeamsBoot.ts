declare global {
  interface Window {
    __solutionPlayBeamsDestroy?: () => void;
  }
}

import { runAfterNextPaint } from "./scheduleFrame";

const BEAM_COUNT = 18;

function destroyBackgroundBeams() {
  document.querySelector(".light-beams-stream")?.replaceChildren();
  delete window.__solutionPlayBeamsDestroy;
}

function initBackgroundBeams() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyBackgroundBeams();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const stream = document.querySelector<HTMLElement>(".light-beams-stream");
  if (!stream) return;

  stream.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < BEAM_COUNT; i++) {
    const riseDur = Math.random() * 2 + 4;
    const fadeDur = riseDur;
    const dropDur = Math.random() * 3 + 3;

    const beam = document.createElement("div");
    beam.className = "light-beam";
    beam.style.left = `${Math.random() * 100}%`;
    beam.style.width = `${Math.floor(Math.random() * 3) + 1}px`;
    beam.style.animationDelay = `${Math.random() * 5}s`;
    beam.style.setProperty("--rise-dur", `${riseDur}s`);
    beam.style.setProperty("--fade-dur", `${fadeDur}s`);
    beam.style.setProperty("--drop-dur", `${dropDur}s`);
    fragment.appendChild(beam);
  }

  stream.appendChild(fragment);
  window.__solutionPlayBeamsDestroy = destroyBackgroundBeams;
}

void runAfterNextPaint(initBackgroundBeams);
document.addEventListener("astro:page-load", () => runAfterNextPaint(initBackgroundBeams));

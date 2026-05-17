declare global {
  interface Window {
    __solutionPlayBeamsDestroy?: () => void;
  }
}

import { backgroundBeamCount, prefersReducedMotion } from "./deviceProfile";
import { getActiveSpaSlide, onSpaSlideChange } from "./spaSlideEvents";
import { runAfterNextPaint } from "./scheduleFrame";

function destroyBackgroundBeams() {
  document.querySelector(".light-beams-stream")?.replaceChildren();
  delete window.__solutionPlayBeamsDestroy;
}

let unsubBeamsSlide: (() => void) | null = null;

function paintBackgroundBeams() {
  const beamCount = backgroundBeamCount();
  if (prefersReducedMotion() || beamCount === 0) return;

  const stream = document.querySelector<HTMLElement>(".light-beams-stream");
  if (!stream) return;

  stream.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < beamCount; i++) {
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

function syncBackgroundBeams() {
  const slide = getActiveSpaSlide();
  if (slide === "hero" || slide === "services" || slide === "commercial" || slide === "contact") {
    destroyBackgroundBeams();
    return;
  }
  paintBackgroundBeams();
}

function initBackgroundBeams() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyBackgroundBeams();
    unsubBeamsSlide?.();
    unsubBeamsSlide = null;
    return;
  }

  if (!unsubBeamsSlide) {
    unsubBeamsSlide = onSpaSlideChange(() => runAfterNextPaint(syncBackgroundBeams));
  }

  syncBackgroundBeams();
}

void runAfterNextPaint(initBackgroundBeams);
document.addEventListener("astro:page-load", () => runAfterNextPaint(initBackgroundBeams));

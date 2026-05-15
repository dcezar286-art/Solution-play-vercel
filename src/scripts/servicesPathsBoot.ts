import gsap from "gsap";
import { getActiveSpaSlide, onSpaSlideChange } from "./spaSlideEvents";

const PATH_COUNT = 36;
let timelines: gsap.core.Timeline[] = [];
let opacityTweens: gsap.core.Tween[] = [];
let unsubSlide: (() => void) | null = null;
let built = false;

function isServicesSlide() {
  return getActiveSpaSlide() === "services";
}

function destroyServicesPaths() {
  timelines.forEach((tl) => tl.kill());
  timelines = [];
  opacityTweens.forEach((tw) => tw.kill());
  opacityTweens = [];
  unsubSlide?.();
  unsubSlide = null;
  built = false;
  delete window.__solutionPlayServicesPathsDestroy;
}

function animatePath(path: SVGPathElement, index: number) {
  const length = path.getTotalLength();
  if (!length) return;

  const duration = 20 + Math.random() * 10;
  const baseOpacity = 0.1 + index * 0.03;

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length * 0.7,
    opacity: baseOpacity,
  });

  const tl = gsap.timeline({ repeat: -1, ease: "none" });
  tl.to(path, {
    strokeDashoffset: -length,
    duration,
    ease: "none",
  });

  const tw = gsap.to(path, {
    opacity: baseOpacity + 0.25,
    duration: duration * 0.22,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  timelines.push(tl);
  opacityTweens.push(tw);
}

function buildPathsIfNeeded(host: HTMLElement) {
  if (built) return;
  const paths = host.querySelectorAll<SVGPathElement>("[data-services-path]");
  paths.forEach((path, i) => {
    animatePath(path, i % PATH_COUNT);
  });
  built = true;
}

function playAll() {
  timelines.forEach((tl) => {
    tl.pause(0);
    if (isServicesSlide()) tl.play();
    else tl.pause();
  });
  opacityTweens.forEach((tw) => {
    if (isServicesSlide()) tw.resume();
    else tw.pause();
  });
}

function initServicesPaths() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyServicesPaths();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const host = document.querySelector<HTMLElement>("[data-services-paths-host]");
  if (!host) return;

  destroyServicesPaths();

  unsubSlide = onSpaSlideChange((id) => {
    if (id === "services") buildPathsIfNeeded(host);
    playAll();
  });

  if (isServicesSlide()) {
    buildPathsIfNeeded(host);
    playAll();
  }

  window.__solutionPlayServicesPathsDestroy = destroyServicesPaths;
}

declare global {
  interface Window {
    __solutionPlayServicesPathsDestroy?: () => void;
  }
}

void initServicesPaths();
document.addEventListener("astro:page-load", initServicesPaths);

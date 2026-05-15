declare global {
  interface Window {
    __solutionPlaySpaDestroy?: () => void;
    __solutionPlayLenisDestroy?: () => void;
  }
}

import gsap from "gsap";

const SLIDE_IDS = ["hero", "services", "commercial", "contact", "dono", "footer"] as const;

type SlideId = (typeof SLIDE_IDS)[number];

/** Posição do cubo por slide (%, scale, rotate, opacity). */
const CUBE_BY_SLIDE: Record<
  SlideId,
  { x: number; y: number; scale: number; rotate: number; opacity: number }
> = {
  hero: { x: 50, y: 46, scale: 1.12, rotate: 0, opacity: 0.88 },
  services: { x: 82, y: 16, scale: 0.5, rotate: 14, opacity: 0.78 },
  commercial: { x: 18, y: 68, scale: 0.48, rotate: -10, opacity: 0.7 },
  contact: { x: 74, y: 52, scale: 0.56, rotate: 8, opacity: 0.65 },
  dono: { x: 50, y: 36, scale: 0.68, rotate: -18, opacity: 0.72 },
  footer: { x: 86, y: 78, scale: 0.38, rotate: 0, opacity: 0.4 },
};

let currentIndex = 0;
let isAnimating = false;
let ctx: gsap.Context | null = null;

function setActiveScene(sceneId: SlideId) {
  document.querySelectorAll<HTMLElement>("[data-scene-backdrop]").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.sceneBackdrop === sceneId);
  });
}

function setSidebarActive(index: number) {
  document.querySelectorAll<HTMLElement>(".spa-sidebar__item").forEach((btn, i) => {
    const active = i === index;
    btn.classList.toggle("is-active", active);
    if (active) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
}

function animateCube(sceneId: SlideId, duration = 0.85) {
  const wrap = document.querySelector<HTMLElement>("[data-cube-wrap]");
  if (!wrap) return;
  const cfg = CUBE_BY_SLIDE[sceneId];
  gsap.to(wrap, {
    duration,
    ease: "power3.inOut",
    "--cube-x": `${cfg.x}%`,
    "--cube-y": `${cfg.y}%`,
    "--cube-scale": cfg.scale,
    "--cube-rotate": cfg.rotate,
    "--cube-opacity": cfg.opacity,
  });
}

function goToSlide(index: number) {
  if (index < 0 || index >= SLIDE_IDS.length || index === currentIndex || isAnimating) return;

  const slides = gsap.utils.toArray<HTMLElement>(".spa-slide");
  const outgoing = slides[currentIndex];
  const incoming = slides[index];
  if (!outgoing || !incoming) return;

  const direction = index > currentIndex ? 1 : -1;
  const sceneId = SLIDE_IDS[index];
  isAnimating = true;

  document.documentElement.dataset.spaSlide = sceneId;
  setSidebarActive(index);
  setActiveScene(sceneId);
  animateCube(sceneId);

  const xFrom = direction * 56;
  const xTo = direction * -56;

  incoming.style.zIndex = "3";
  outgoing.style.zIndex = "2";

  gsap
    .timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        outgoing.classList.remove("is-active");
        outgoing.setAttribute("aria-hidden", "true");
        incoming.classList.add("is-active");
        incoming.setAttribute("aria-hidden", "false");
        gsap.set(outgoing, { clearProps: "all" });
        gsap.set(incoming, { clearProps: "all" });
        outgoing.style.zIndex = "";
        incoming.style.zIndex = "";
        currentIndex = index;
        isAnimating = false;
      },
    })
    .to(outgoing, { autoAlpha: 0, x: xTo, duration: 0.45 }, 0)
    .fromTo(incoming, { autoAlpha: 0, x: xFrom }, { autoAlpha: 1, x: 0, duration: 0.55 }, 0.08);
}

function bindNavigation() {
  document.querySelectorAll<HTMLElement>("[data-slide-jump]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = (el as HTMLElement).dataset.slideJump as SlideId | undefined;
      if (!id) return;
      if (el.tagName === "A") e.preventDefault();
      const index = SLIDE_IDS.indexOf(id);
      if (index >= 0) goToSlide(index);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (isAnimating) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      goToSlide(Math.min(currentIndex + 1, SLIDE_IDS.length - 1));
    }
    if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goToSlide(Math.max(currentIndex - 1, 0));
    }
  });
}

function initCubeHover() {
  const wrap = document.querySelector<HTMLElement>("[data-cube-wrap]");
  if (!wrap) return;

  wrap.addEventListener("pointerenter", () => wrap.classList.add("is-hover"));
  wrap.addEventListener("pointerleave", () => wrap.classList.remove("is-hover"));

  wrap.addEventListener("pointermove", (e) => {
    const r = wrap.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    wrap.style.setProperty("--beam-x", `${px}%`);
    wrap.style.setProperty("--beam-y", `${py}%`);
  });
}

function initCubeDefaults() {
  const wrap = document.querySelector<HTMLElement>("[data-cube-wrap]");
  if (!wrap) return;
  const hero = CUBE_BY_SLIDE.hero;
  wrap.style.setProperty("--cube-x", `${hero.x}%`);
  wrap.style.setProperty("--cube-y", `${hero.y}%`);
  wrap.style.setProperty("--cube-scale", String(hero.scale));
  wrap.style.setProperty("--cube-rotate", String(hero.rotate));
  wrap.style.setProperty("--cube-opacity", String(hero.opacity));
}

export function destroySpaSlides() {
  ctx?.revert();
  ctx = null;
  window.__solutionPlayLenisDestroy?.();
  delete window.__solutionPlaySpaDestroy;
}

export function initSpaSlides() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroySpaSlides();
    return;
  }

  destroySpaSlides();
  window.__solutionPlayLenisDestroy?.();

  const slides = document.querySelectorAll<HTMLElement>(".spa-slide");
  if (!slides.length) return;

  currentIndex = 0;
  isAnimating = false;
  document.documentElement.dataset.spaSlide = "hero";

  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === 0);
    slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
  });

  initCubeDefaults();
  initCubeHover();
  bindNavigation();

  ctx = gsap.context(() => {});
  window.__solutionPlaySpaDestroy = destroySpaSlides;
}

void initSpaSlides();
document.addEventListener("astro:page-load", initSpaSlides);

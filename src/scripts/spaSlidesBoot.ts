declare global {
  interface Window {
    __solutionPlaySpaDestroy?: () => void;
    __solutionPlayLenisDestroy?: () => void;
  }
}

import gsap from "gsap";
import { syncMenuCursor } from "./interactiveMenuBoot";
import { emitSpaSlideChange } from "./spaSlideEvents";

const SLIDE_IDS = ["hero", "services", "commercial", "contact"] as const;

type SlideId = (typeof SLIDE_IDS)[number];

let currentIndex = 0;
let isAnimating = false;
let ctx: gsap.Context | null = null;

function setMenuActive(index: number) {
  document.querySelectorAll<HTMLElement>(".interactive-menu__item").forEach((btn, i) => {
    const active = i === index;
    btn.classList.toggle("active", active);
    if (active) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  requestAnimationFrame(() => syncMenuCursor());
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
  setMenuActive(index);

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
        emitSpaSlideChange(SLIDE_IDS[index]);
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

  const params = new URLSearchParams(window.location.search);
  const slideParam = params.get("slide") as SlideId | null;
  const startIndex =
    slideParam && SLIDE_IDS.includes(slideParam) ? SLIDE_IDS.indexOf(slideParam) : 0;

  currentIndex = startIndex;
  isAnimating = false;
  const startScene = SLIDE_IDS[startIndex];
  document.documentElement.dataset.spaSlide = startScene;

  slides.forEach((slide, i) => {
    const active = i === startIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", active ? "false" : "true");
    gsap.set(slide, { autoAlpha: active ? 1 : 0, x: 0 });
  });

  setMenuActive(startIndex);
  emitSpaSlideChange(startScene);
  bindNavigation();

  ctx = gsap.context(() => {});
  window.__solutionPlaySpaDestroy = destroySpaSlides;
}

void initSpaSlides();
document.addEventListener("astro:page-load", initSpaSlides);

declare global {
  interface Window {
    __solutionPlayLenisDestroy?: () => void;
  }
}

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function setActiveScene(sceneId: string) {
  document.querySelectorAll<HTMLElement>("[data-scene-backdrop]").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.sceneBackdrop === sceneId);
  });
  document.querySelectorAll<HTMLElement>(".scene-indicator__btn").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.sceneJump === sceneId);
  });
  document.querySelectorAll<HTMLElement>(".scene-indicator__name").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.sceneName === sceneId);
  });
}

/** Transições por secção: blur 10px + scrub (modelo fromanother, via ScrollTrigger). */
function registerFromanotherScenes() {
  const sections = gsap.utils.toArray<HTMLElement>(".scene-detector");

  const progressBar = document.querySelector<HTMLElement>(".scroll-progress__bar");
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });
  }

  sections.forEach((section, index) => {
    const sceneId = section.dataset.scene ?? "";
    const target = section.querySelector<HTMLElement>(".scene-enter");
    if (!target) return;

    if (index === 0) {
      gsap.set(target, { autoAlpha: 1, filter: "blur(0px)", y: 0 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 20%",
        onEnter: () => sceneId && setActiveScene(sceneId),
        onEnterBack: () => sceneId && setActiveScene(sceneId),
      });
      return;
    }

    gsap.fromTo(
      target,
      { autoAlpha: 0, filter: "blur(10px)", y: 32 },
      {
        autoAlpha: 1,
        filter: "blur(0px)",
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          end: "top 42%",
          scrub: 0.5,
        },
      }
    );

    ScrollTrigger.create({
      trigger: section,
      start: "top 55%",
      end: "bottom 35%",
      onEnter: () => sceneId && setActiveScene(sceneId),
      onEnterBack: () => sceneId && setActiveScene(sceneId),
    });
  });

  document.querySelectorAll<HTMLElement>(".scene-indicator__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.sceneJump;
      if (!id) return;
      const section = document.querySelector<HTMLElement>(`[data-scene="${id}"]`);
      if (!section) return;
      lenis?.scrollTo(section, { offset: -72 });
    });
  });
}

/** Parallax com scrub (acoplado ao scroll, estilo editorial / motion sites). */
function registerHomeParallax() {
  const hero = document.querySelector<HTMLElement>(".hero.hero--studio.snap-section");
  if (hero) {
    const atmos = hero.querySelector<HTMLElement>(".hero-studio-atmos");
    if (atmos) {
      gsap.fromTo(
        atmos,
        { y: 0, opacity: 1 },
        {
          y: 130,
          opacity: 0.22,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.55,
          },
        }
      );
    }

    const mega = hero.querySelector<HTMLElement>(".hero-mega");
    if (mega) {
      gsap.fromTo(
        mega,
        { y: 0 },
        {
          y: 52,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 45%",
            scrub: 0.42,
          },
        }
      );
    }

    const aside = hero.querySelector<HTMLElement>(".hero-studio-panel");
    if (aside) {
      gsap.fromTo(
        aside,
        { y: 0 },
        {
          y: -64,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.38,
          },
        }
      );
    }
  }

  const stack = document.querySelector<HTMLElement>(".snap-panel-stack.snap-section");
  if (stack) {
    const marquee = stack.querySelector<HTMLElement>(".marquee-strip");
    if (marquee) {
      gsap.fromTo(
        marquee,
        { y: 0 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: stack,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.62,
          },
        }
      );
    }

    const sectionHead = stack.querySelector<HTMLElement>(".section-head");
    if (sectionHead) {
      gsap.fromTo(
        sectionHead,
        { y: 0 },
        {
          y: -32,
          ease: "none",
          scrollTrigger: {
            trigger: stack,
            start: "top 88%",
            end: "center center",
            scrub: 0.48,
          },
        }
      );
    }
  }

  const commercial = document.querySelector<HTMLElement>(".commercial--studio.snap-section");
  if (commercial) {
    const inner = commercial.querySelector<HTMLElement>(".commercial-inner");
    if (inner) {
      gsap.fromTo(
        inner,
        { y: 0 },
        {
          y: -44,
          ease: "none",
          scrollTrigger: {
            trigger: commercial,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.68,
          },
        }
      );
    }
  }

  const lead = document.querySelector<HTMLElement>(".lead-section--studio.snap-section");
  if (lead) {
    const grid = lead.querySelector<HTMLElement>(".lead-grid");
    if (grid) {
      gsap.fromTo(
        grid,
        { y: 36 },
        {
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: lead,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.52,
          },
        }
      );
    }
  }

  const dono = document.querySelector<HTMLElement>(".snap-section--dono");
  if (dono) {
    const stage = dono.querySelector<HTMLElement>(".dono-fiber__stage");
    if (stage) {
      gsap.fromTo(
        stage,
        { y: 0, rotate: 0 },
        {
          y: -52,
          rotate: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: dono,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.72,
          },
        }
      );
    }
  }

  const footer = document.querySelector<HTMLElement>("footer.site-footer--studio.snap-section");
  if (footer) {
    const cols = footer.querySelector<HTMLElement>(".wrap.cols");
    if (cols) {
      gsap.fromTo(
        cols,
        { y: 40 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "top 42%",
            scrub: 0.5,
          },
        }
      );
    }
  }
}

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;
let ctx: gsap.Context | null = null;

export function destroyHomeMotion() {
  ctx?.revert();
  ctx = null;

  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }

  lenis?.destroy();
  lenis = null;

  ScrollTrigger.getAll().forEach((t) => t.kill());

  const w = window;
  if (w.__solutionPlayLenisDestroy) {
    delete w.__solutionPlayLenisDestroy;
  }
}

export function initHomeMotion() {
  if (!document.documentElement.classList.contains("home-motion")) {
    destroyHomeMotion();
    return;
  }

  destroyHomeMotion();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(".snap-section .scene-enter", {
      clearProps: "opacity,filter,transform,visibility",
    });
    return;
  }

  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.088,
    wheelMultiplier: 0.92,
    allowNestedScroll: true,
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  ctx = gsap.context(() => {
    registerFromanotherScenes();
    registerHomeParallax();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  window.__solutionPlayLenisDestroy = destroyHomeMotion;
}

void initHomeMotion();
document.addEventListener("astro:page-load", initHomeMotion);

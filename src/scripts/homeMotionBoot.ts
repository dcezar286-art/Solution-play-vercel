declare global {
  interface Window {
    __solutionPlayLenisDestroy?: () => void;
  }
}

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    const blocks = gsap.utils.toArray<HTMLElement>(".snap-section");

    blocks.forEach((section, index) => {
      const target = section.querySelector<HTMLElement>(".scene-enter");
      if (!target) return;

      if (index === 0) {
        gsap.set(target, { autoAlpha: 1, filter: "blur(0px)", y: 0 });
        return;
      }

      gsap.fromTo(
        target,
        { autoAlpha: 0, filter: "blur(12px)", y: 36 },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.88,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  window.__solutionPlayLenisDestroy = destroyHomeMotion;
}

void initHomeMotion();
document.addEventListener("astro:page-load", initHomeMotion);

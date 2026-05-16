import type gsap from "gsap";

let gsapPromise: Promise<typeof gsap> | null = null;

/** Carrega GSAP sob demanda (reduz TBT no carregamento inicial). */
export function loadGsap(): Promise<typeof gsap> {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((m) => m.default);
  }
  return gsapPromise;
}

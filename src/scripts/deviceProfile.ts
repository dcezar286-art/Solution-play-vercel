/** Perfil do dispositivo — efeitos pesados só em mobile / acessibilidade. */

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersReducedData(): boolean {
  return window.matchMedia("(prefers-reduced-data: reduce)").matches;
}

export function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}

/** WebGL do hero — desligado só em mobile (desktop mantém o efeito). */
export function shouldRunHeroShader(): boolean {
  if (prefersReducedMotion() || prefersReducedData()) return false;
  if (isMobileViewport()) return false;
  return true;
}

/** Three.js (contratos) — desligado em mobile. */
export function shouldRunThreeEffects(): boolean {
  if (prefersReducedMotion() || prefersReducedData()) return false;
  if (isMobileViewport()) return false;
  return true;
}

export function neuralParticleCount(): number {
  if (prefersReducedMotion()) return 0;
  if (isMobileViewport()) return 140;
  return 360;
}

export function backgroundBeamCount(): number {
  if (prefersReducedMotion()) return 0;
  if (isMobileViewport()) return 8;
  return 18;
}

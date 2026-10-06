export type MotionPreference = {
  webgl: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  width: number;
  height: number;
  dpr: number;
  quality: "static" | "low" | "medium" | "high";
};

let webglSupport: boolean | undefined;
function supportsWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webglSupport = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return webglSupport;
  } catch {
    return (webglSupport = false);
  }
}

export function getMotionPreference(): MotionPreference {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const webgl = supportsWebGL();
  const cappedDpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.35 : 1.5);

  let quality: MotionPreference["quality"] = "high";

  if (!webgl || reducedMotion) {
    quality = "static";
  } else if (coarsePointer || width < 768) {
    quality = "low";
  } else if (width < 1200) {
    quality = "medium";
  }

  return {
    webgl,
    reducedMotion,
    coarsePointer,
    width,
    height,
    dpr: cappedDpr,
    quality,
  };
}

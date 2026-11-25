/**
 * Decide se o cubo 3D (Three.js) deve ser carregado.
 * Só carrega em telas grandes, com mouse, WebGL2 e sem "reduzir movimento".
 * Caso contrário, o cubo em CSS continua visível — nada quebra.
 */

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function shouldLoad3D(): boolean {
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (!wide || !finePointer || reduced) return false;
  if (lowMemory !== undefined && lowMemory < 4) return false;
  return hasWebGL2();
}

const canvas = document.querySelector<HTMLCanvasElement>("[data-cube-canvas]");

if (canvas && shouldLoad3D()) {
  const start = () =>
    import("./cubeScene")
      .then(({ mountCubeScene }) => mountCubeScene(canvas))
      .catch((error) => {
        console.warn("[Solution Play] Cubo 3D indisponível, mantendo versão leve.", error);
      });

  // Espera a página ficar pronta para não competir com o carregamento do texto.
  if (document.readyState === "complete") setTimeout(start, 150);
  else window.addEventListener("load", () => setTimeout(start, 150), { once: true });
}

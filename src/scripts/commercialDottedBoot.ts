import { shouldRunThreeEffects } from "./deviceProfile";
import { getActiveSpaSlide, onSpaSlideChange, type SpaSlideId } from "./spaSlideEvents";
import { runAfterNextPaint } from "./scheduleFrame";

type ThreeModule = typeof import("three");

const ROOT_ID = "__sp-commercial-dotted";
const SEPARATION = 150;
/** Alinhado ao DottedSurface de referência (40×60). */
const AMOUNTX = 40;
const AMOUNTY = 60;

type SceneBundle = {
  scene: InstanceType<ThreeModule["Scene"]>;
  camera: InstanceType<ThreeModule["PerspectiveCamera"]>;
  renderer: InstanceType<ThreeModule["WebGLRenderer"]>;
  geometry: InstanceType<ThreeModule["BufferGeometry"]>;
  count: number;
};

let raf = 0;
let bundle: SceneBundle | null = null;
let hostEl: HTMLElement | null = null;
let threeLoader: Promise<ThreeModule> | null = null;
let unsubSlide: (() => void) | null = null;
let onWinResize: (() => void) | null = null;

function isCommercialSlide() {
  return getActiveSpaSlide() === "commercial";
}

function loadThree(): Promise<ThreeModule> {
  if (!threeLoader) threeLoader = import("three");
  return threeLoader;
}

/** Viewport inteiro — mesmo conceito do `fixed inset-0` no React. */
function measureViewport() {
  const w = Math.max(1, Math.floor(window.innerWidth));
  const h = Math.max(1, Math.floor(window.innerHeight));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return { w, h, dpr };
}

function getOrCreateRoot(): HTMLElement {
  let el = document.getElementById(ROOT_ID) as HTMLElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = ROOT_ID;
    el.className = "commercial-dotted-root is-hidden";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

function setRootVisible(visible: boolean) {
  if (!hostEl) return;
  hostEl.classList.toggle("is-hidden", !visible);
  hostEl.setAttribute("aria-hidden", "true");
}

function disposeBundle() {
  cancelAnimationFrame(raf);
  raf = 0;
  if (!bundle) return;
  bundle.geometry.dispose();
  const pts = bundle.scene.children[0] as import("three").Points;
  (pts.material as import("three").Material).dispose();
  bundle.renderer.dispose();
  bundle.renderer.domElement.remove();
  bundle = null;
  hostEl?.querySelector(".commercial-dotted-vignette")?.remove();
}

function destroyCommercialDotted() {
  disposeBundle();
  if (onWinResize) {
    window.removeEventListener("resize", onWinResize);
    onWinResize = null;
  }
  unsubSlide?.();
  unsubSlide = null;

  hostEl?.remove();
  hostEl = null;

  delete window.__solutionPlayCommercialDottedDestroy;
}

function onResize() {
  if (!bundle || !hostEl) return;
  const m = measureViewport();
  bundle.camera.aspect = m.w / m.h;
  bundle.camera.updateProjectionMatrix();
  bundle.renderer.setPixelRatio(m.dpr);
  bundle.renderer.setSize(m.w, m.h);
}

function renderFrame() {
  if (!bundle) return;
  const { geometry, renderer, scene, camera } = bundle;
  const positions = geometry.attributes.position.array as Float32Array;
  let i = 0;
  bundle.count += 0.1;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const index = i * 3;
      positions[index + 1] =
        Math.sin((ix + bundle.count) * 0.3) * 50 + Math.sin((iy + bundle.count) * 0.5) * 50;
      i++;
    }
  }
  geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

function animate() {
  raf = requestAnimationFrame(animate);
  if (bundle && isCommercialSlide()) renderFrame();
}

function startLoop() {
  if (raf) return;
  raf = requestAnimationFrame(animate);
}

function wake() {
  if (!bundle) return;
  onResize();
  renderFrame();
  requestAnimationFrame(renderFrame);
}

function buildScene(THREE: ThreeModule, root: HTMLElement) {
  const { w, h, dpr } = measureViewport();

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

  const camera = new THREE.PerspectiveCamera(60, w / h, 1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h);
  renderer.setClearColor(scene.fog.color, 0);

  const canvas = renderer.domElement;
  canvas.className = "commercial-dotted-canvas";
  root.appendChild(canvas);

  const vig = document.createElement("div");
  vig.className = "commercial-dotted-vignette";
  vig.setAttribute("aria-hidden", "true");
  root.appendChild(vig);

  const positions: number[] = [];
  const colors: number[] = [];
  const gray = 200 / 255;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions.push(
        ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
        0,
        iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
      );
      colors.push(gray, gray, gray);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  scene.add(new THREE.Points(geometry, material));

  bundle = { scene, camera, renderer, geometry, count: 0 };
}

async function ensureCommercialScene() {
  if (!hostEl || bundle) return;

  const THREE = await loadThree();
  buildScene(THREE, hostEl);
  onResize();

  if (isCommercialSlide()) {
    wake();
    startLoop();
  }
}

function onSlideChange(id: SpaSlideId) {
  if (id === "commercial") {
    setRootVisible(true);
    void ensureCommercialScene().then(() => {
      if (bundle && isCommercialSlide()) {
        wake();
        startLoop();
      }
    });
  } else {
    setRootVisible(false);
    disposeBundle();
  }
}

function initCommercialDotted() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyCommercialDotted();
    return;
  }

  if (!shouldRunThreeEffects()) return;

  destroyCommercialDotted();
  hostEl = getOrCreateRoot();

  onWinResize = () => onResize();
  window.addEventListener("resize", onWinResize);

  unsubSlide = onSpaSlideChange(onSlideChange);

  if (isCommercialSlide()) {
    setRootVisible(true);
    void ensureCommercialScene();
  } else {
    setRootVisible(false);
  }

  queueMicrotask(() => {
    onSlideChange(getActiveSpaSlide());
  });

  window.__solutionPlayCommercialDottedDestroy = destroyCommercialDotted;
}

declare global {
  interface Window {
    __solutionPlayCommercialDottedDestroy?: () => void;
  }
}

function scheduleCommercialInit() {
  runAfterNextPaint(() => initCommercialDotted());
}

void scheduleCommercialInit();
document.addEventListener("astro:page-load", scheduleCommercialInit);

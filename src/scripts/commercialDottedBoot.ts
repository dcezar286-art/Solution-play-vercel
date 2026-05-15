import * as THREE from "three";
import { getActiveSpaSlide, onSpaSlideChange } from "./spaSlideEvents";

const SEPARATION = 150;
const AMOUNTX = 40;
const AMOUNTY = 60;

type SceneBundle = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  geometry: THREE.BufferGeometry;
  count: number;
};

let raf = 0;
let bundle: SceneBundle | null = null;
let hostEl: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;

function isCommercialSlide() {
  return getActiveSpaSlide() === "commercial";
}

function measure(host: HTMLElement) {
  const rect = host.getBoundingClientRect();
  return {
    w: Math.max(1, rect.width),
    h: Math.max(1, rect.height),
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  };
}

function destroyCommercialDotted() {
  cancelAnimationFrame(raf);
  raf = 0;
  hostEl = null;
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (bundle) {
    bundle.geometry.dispose();
    (bundle.scene.children[0] as THREE.Points).material.dispose();
    bundle.renderer.dispose();
    bundle.renderer.domElement.remove();
    bundle = null;
  }

  delete window.__solutionPlayCommercialDottedDestroy;
}

function onResize() {
  if (!bundle || !hostEl) return;
  const m = measure(hostEl);
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

function wake() {
  if (!bundle) return;
  onResize();
  renderFrame();
  requestAnimationFrame(renderFrame);
}

function buildScene(host: HTMLElement) {
  const { w, h, dpr } = measure(host);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x030308, 2800, 12000);

  const camera = new THREE.PerspectiveCamera(60, w / h, 1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.className = "commercial-dotted-canvas";
  host.prepend(canvas);

  const positions: number[] = [];
  const colors: number[] = [];
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions.push(
        ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
        0,
        iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
      );
      colors.push(0.37, 0.92, 0.83);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 14,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
  });

  scene.add(new THREE.Points(geometry, material));

  bundle = { scene, camera, renderer, geometry, count: 0 };
}

function initCommercialDotted() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyCommercialDotted();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const host = document.querySelector<HTMLElement>("[data-commercial-dotted-host]");
  if (!host) return;

  destroyCommercialDotted();
  hostEl = host;
  buildScene(host);

  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(host);

  onSpaSlideChange((id) => {
    if (id === "commercial") wake();
  });

  raf = requestAnimationFrame(animate);
  if (isCommercialSlide()) wake();

  window.__solutionPlayCommercialDottedDestroy = destroyCommercialDotted;
}

declare global {
  interface Window {
    __solutionPlayCommercialDottedDestroy?: () => void;
  }
}

void initCommercialDotted();
document.addEventListener("astro:page-load", initCommercialDotted);

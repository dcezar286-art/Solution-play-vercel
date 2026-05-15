import * as THREE from "three";
import { equipeHillsFragmentShader, equipeHillsVertexShader } from "../data/equipeHillsShaders";
import { getActiveSpaSlide, onSpaSlideChange } from "./spaSlideEvents";

const CAMERA_Z = 125;
const PLANE_SIZE = 256;
const SPEED = 0.5;

type HillsBundle = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  plane: { uniforms: { time: { value: number } }; mesh: THREE.Mesh };
};

let raf = 0;
let bundle: HillsBundle | null = null;
let hostEl: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;

function isEquipeSlide() {
  return getActiveSpaSlide() === "dono";
}

function measure(host: HTMLElement) {
  const rect = host.getBoundingClientRect();
  return {
    w: Math.max(1, rect.width),
    h: Math.max(1, rect.height),
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  };
}

function destroyEquipeHills() {
  cancelAnimationFrame(raf);
  raf = 0;
  hostEl = null;
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (bundle) {
    bundle.plane.mesh.geometry.dispose();
    (bundle.plane.mesh.material as THREE.Material).dispose();
    bundle.renderer.dispose();
    bundle.renderer.domElement.remove();
    bundle = null;
  }

  delete window.__solutionPlayEquipeHillsDestroy;
}

function createPlane() {
  const uniforms = { time: { value: 0 } };
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, PLANE_SIZE, PLANE_SIZE),
    new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: equipeHillsVertexShader,
      fragmentShader: equipeHillsFragmentShader,
      transparent: true,
    })
  );
  return { uniforms, mesh };
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
  bundle.plane.uniforms.time.value += bundle.clock.getDelta() * SPEED;
  bundle.renderer.render(bundle.scene, bundle.camera);
}

function animate() {
  raf = requestAnimationFrame(animate);
  if (bundle && isEquipeSlide()) renderFrame();
}

function wake() {
  if (!bundle) return;
  onResize();
  renderFrame();
  requestAnimationFrame(renderFrame);
}

function initEquipeHills() {
  if (!document.documentElement.classList.contains("home-spa")) {
    destroyEquipeHills();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const host = document.querySelector<HTMLElement>("[data-equipe-hills-host]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-equipe-hills-canvas]");
  if (!host || !canvas) return;

  destroyEquipeHills();
  hostEl = host;

  const { w, h, dpr } = measure(host);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
  camera.position.set(0, 16, CAMERA_Z);
  camera.lookAt(0, 28, 0);

  const plane = createPlane();
  scene.add(plane.mesh);

  bundle = { renderer, scene, camera, clock: new THREE.Clock(), plane };

  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(host);

  onSpaSlideChange((id) => {
    if (id === "dono") wake();
  });

  raf = requestAnimationFrame(animate);
  if (isEquipeSlide()) wake();

  window.__solutionPlayEquipeHillsDestroy = destroyEquipeHills;
}

declare global {
  interface Window {
    __solutionPlayEquipeHillsDestroy?: () => void;
  }
}

void initEquipeHills();
document.addEventListener("astro:page-load", initEquipeHills);

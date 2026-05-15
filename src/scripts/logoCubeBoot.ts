let activeDispose: (() => void) | undefined;

function destroy() {
  activeDispose?.();
  activeDispose = undefined;
}

async function start() {
  destroy();
  const root = document.getElementById("logo-cube-root");
  if (!root || !(root instanceof HTMLElement)) return;

  const THREE = await import("three");
  const src = root.dataset.logoSrc;
  const canvas = root.querySelector(".logo-cube__canvas");
  if (!src || !canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let disposed = false;
  let raf = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0, 5.35);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const pivot = new THREE.Group();
  scene.add(pivot);

  let targetTiltX = 0;
  let targetTiltY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let baseY = 0;

  const onMove = (e: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetTiltY = nx * 0.58;
    targetTiltX = -ny * 0.48;
  };
  const onLeave = () => {
    targetTiltX = 0;
    targetTiltY = 0;
  };
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);

  const resize = () => {
    const w = Math.max(1, root.clientWidth);
    const h = Math.max(1, root.clientHeight || root.clientWidth);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(root);

  const loader = new THREE.TextureLoader();

  const cleanupListeners = () => {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    ro.disconnect();
    cancelAnimationFrame(raf);
  };

  let meshDispose: (() => void) | undefined;

  activeDispose = () => {
    disposed = true;
    cleanupListeners();
    meshDispose?.();
    meshDispose = undefined;
    renderer.dispose();
  };

  loader.load(
    src,
    (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() ?? 4);

      const size = 2.38;
      const boxGeo = new THREE.BoxGeometry(size, size, size);

      const innerGeo = new THREE.BoxGeometry(size * 0.94, size * 0.94, size * 0.94);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x02040a,
        transparent: true,
        opacity: 0.22,
        depthWrite: true,
      });
      const innerShell = new THREE.Mesh(innerGeo, innerMat);
      pivot.add(innerShell);

      const edgeGeo = new THREE.EdgesGeometry(boxGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x5eead4,
        transparent: true,
        opacity: 0.88,
      });
      const wireCube = new THREE.LineSegments(edgeGeo, wireMat);
      pivot.add(wireCube);

      const img = texture.image as HTMLImageElement;
      const asp = (img?.width ?? 1) / Math.max(1, img?.height ?? 1);
      const planeH = 1.22;
      const planeW = planeH * asp;
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        toneMapped: false,
        depthTest: true,
        depthWrite: true,
        side: THREE.DoubleSide,
        opacity: 1,
      });
      const logoPlane = new THREE.Mesh(planeGeo, planeMat);
      pivot.add(logoPlane);

      const spin = reduce ? 0.0028 : 0.0068;

      const tick = () => {
        if (disposed) return;
        baseY += spin;
        tiltX = THREE.MathUtils.lerp(tiltX, targetTiltX, 0.085);
        tiltY = THREE.MathUtils.lerp(tiltY, targetTiltY, 0.085);
        pivot.rotation.set(tiltX * 0.42, baseY + tiltY * 0.28, tiltY * 0.14);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };

      resize();
      tick();

      meshDispose = () => {
        edgeGeo.dispose();
        wireMat.dispose();
        boxGeo.dispose();
        innerGeo.dispose();
        innerMat.dispose();
        planeGeo.dispose();
        planeMat.dispose();
        texture.dispose();
        pivot.clear();
      };
    },
    undefined,
    () => {
      root.dataset.cubeError = "1";
    }
  );
}

void start();
document.addEventListener("astro:page-load", () => {
  void start();
});

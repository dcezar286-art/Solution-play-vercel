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

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(5, 8, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x2dd4bf, 0.42);
  rim.position.set(-6, -3, -2);
  scene.add(rim);

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

      const geo = new THREE.BoxGeometry(2.25, 2.25, 2.25);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.26,
        roughness: 0.4,
      });
      const cube = new THREE.Mesh(geo, mat);

      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x5eead4,
        transparent: true,
        opacity: 0.22,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      pivot.add(cube);
      pivot.add(edges);

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
        edgeMat.dispose();
        geo.dispose();
        mat.dispose();
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

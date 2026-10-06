import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getMotionPreference } from "./motionPreference";

type CubeTile = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & {
  tileHome: THREE.Vector3;
  tileAxis: THREE.Vector3;
};

const canvas = document.querySelector<HTMLCanvasElement>("[data-cinematic-canvas]");

const SCENE_STATE: Record<
  string,
  {
    camera: THREE.Vector3;
    cube: THREE.Vector3;
    spread: number;
    scale: number;
    emissive: number;
    rings: number;
    core: number;
  }
> = {
  brand: {
    camera: new THREE.Vector3(0, 0.12, 8.2),
    cube: new THREE.Vector3(1.8, 0.32, 0),
    spread: 0.04,
    scale: 1.68,
    emissive: 0.035,
    rings: 0.42,
    core: 1.0,
  },
  services: {
    camera: new THREE.Vector3(-1.15, 0.26, 7.4),
    cube: new THREE.Vector3(0.8, 0.2, -0.2),
    spread: 0.58,
    scale: 1.14,
    emissive: 0.08,
    rings: 0.55,
    core: 0.72,
  },
  trust: {
    camera: new THREE.Vector3(1.05, 0.34, 7.8),
    cube: new THREE.Vector3(-0.72, 0.16, -0.15),
    spread: 0.26,
    scale: 1.0,
    emissive: 0.055,
    rings: 0.78,
    core: 0.88,
  },
  pricing: {
    camera: new THREE.Vector3(0, 0.58, 7.0),
    cube: new THREE.Vector3(0, 0.45, -0.55),
    spread: 0.88,
    scale: 0.9,
    emissive: 0.1,
    rings: 0.42,
    core: 0.54,
  },
  contact: {
    camera: new THREE.Vector3(0.65, 0.2, 8.6),
    cube: new THREE.Vector3(-0.55, 0.05, 0.1),
    spread: 0.12,
    scale: 0.84,
    emissive: 0.04,
    rings: 0.22,
    core: 0.66,
  },
};

function createSolutionPlayCube(quality: "low" | "medium" | "high") {
  const group = new THREE.Group();
  const cubeTiles: CubeTile[] = [];
  const beamPositions: number[] = [];
  const tileSize = 0.32;
  const gap = 0.035;
  const grid = [-1.5, -0.5, 0.5, 1.5];

  const geometry = new RoundedBoxGeometry(tileSize, tileSize, tileSize, 2, Math.min(0.045, tileSize * 0.16));

  grid.forEach((x, xi) => {
    grid.forEach((y, yi) => {
      grid.forEach((z, zi) => {
        const isSurface = xi === 0 || yi === 0 || zi === 0 || xi === grid.length - 1 || yi === grid.length - 1 || zi === grid.length - 1;
        const carveLogoLikeVoid = (xi === 1 && yi === 2 && zi === 0) || (xi === 2 && yi === 1 && zi === grid.length - 1);
        if (!isSurface || carveLogoLikeVoid) return;

        const material = new THREE.MeshStandardMaterial({
          color: 0x111820,
          emissive: 0x18a8bd,
          emissiveIntensity: 0.035,
          roughness: 0.23,
          metalness: 0.92,
          envMapIntensity: 1.8,
        });

        const tile = new THREE.Mesh(geometry, material) as CubeTile;
        const home = new THREE.Vector3(x * (tileSize + gap), y * (tileSize + gap), z * (tileSize + gap));
        tile.tileHome = home;
        tile.tileAxis = home.clone().normalize();
        if (tile.tileAxis.lengthSq() === 0) tile.tileAxis.set(0, 1, 0);
        tile.position.copy(home);
        group.add(tile);
        cubeTiles.push(tile);

        if ((xi + yi + zi) % 3 === 0) {
          const outer = home.clone().multiplyScalar(1.72);
          beamPositions.push(home.x, home.y, home.z, outer.x, outer.y, outer.z);
        }
      });
    });
  });

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5ffff,
    emissive: 0x63f4ff,
    emissiveIntensity: 1.2,
    roughness: 0.18,
    metalness: 0.72,
    transparent: true,
    opacity: 0.88,
  });
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.56, quality === "low" ? 0 : 1), coreMaterial);
  core.name = "solutionPlayCore";
  group.add(core);

  const beamGeometry = new THREE.BufferGeometry();
  beamGeometry.setAttribute("position", new THREE.Float32BufferAttribute(beamPositions, 3));
  const beams = new THREE.LineSegments(
    beamGeometry,
    new THREE.LineBasicMaterial({ color: 0x89fff4, transparent: true, opacity: 0.2 }),
  );
  beams.name = "solutionPlayDataBeams";
  group.add(beams);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.85, 1.85, 1.85)),
    new THREE.LineBasicMaterial({ color: 0xdffcff, transparent: true, opacity: 0.22 }),
  );
  group.add(edge);

  return { group, cubeTiles, edge, core, beams };
}

if (canvas) {
  const initialProfile = getMotionPreference();

  if (initialProfile.quality !== "static") {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: initialProfile.quality !== "low",
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(initialProfile.dpr);
    renderer.setSize(initialProfile.width, initialProfile.height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    canvas.addEventListener("webglcontextlost", () => {
      delete document.documentElement.dataset.sceneReady;
    });
    canvas.addEventListener("webglcontextrestored", () => {
      document.documentElement.dataset.sceneReady = "true";
    });

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x051b20, 0.065);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentMap.texture;
    environment.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(42, initialProfile.width / initialProfile.height, 0.1, 140);
    camera.position.copy(SCENE_STATE.brand.camera);

    const rig = new THREE.Group();
    scene.add(rig);

    const { group: cube, cubeTiles, edge, core, beams } = createSolutionPlayCube(initialProfile.quality);
    cube.position.copy(SCENE_STATE.brand.cube);
    cube.scale.setScalar(SCENE_STATE.brand.scale);
    if (initialProfile.width <= 640) {
      cube.position.set(0.1, 1.55, -0.5);
      cube.scale.setScalar(SCENE_STATE.brand.scale * 0.53);
    }
    rig.add(cube);

    // A dark, rippled ground gives the floating core a physical setting.
    const groundGeometry = new THREE.PlaneGeometry(65, 65, 90, 90);
    groundGeometry.rotateX(-Math.PI / 2);
    const vertices = groundGeometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const z = vertices.getZ(i);
      const wave = Math.sin(x * 0.55 + z * 0.26) * Math.cos(z * 0.42) * 0.32;
      vertices.setY(i, wave + Math.sin(x * 1.3 - z * 0.8) * 0.09);
    }
    groundGeometry.computeVertexNormals();
    const ground = new THREE.Mesh(groundGeometry, new THREE.MeshStandardMaterial({
      color: 0x08272b, metalness: 0.78, roughness: 0.3, envMapIntensity: 0.36,
    }));
    ground.position.y = -2.1;
    scene.add(ground);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 128;
    const context = glowCanvas.getContext("2d")!;
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(40,255,206,0.6)");
    gradient.addColorStop(0.3, "rgba(15,165,155,0.2)");
    gradient.addColorStop(1, "rgba(0,70,65,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glowCanvas), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5,
    }));
    glow.position.set(2.8, 0.5, -3);
    glow.scale.set(9, 6, 1);
    scene.add(glow);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x65f2e6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    const rings: THREE.Mesh[] = [];
    for (let index = 0; index < 2; index += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05 + index * 0.42, 0.006, 8, 180), ringMaterial.clone());
      ring.rotation.x = Math.PI * 0.5 + index * 0.24;
      ring.rotation.y = index * 0.3;
      rig.add(ring);
      rings.push(ring);
    }

    const pointsCount = initialProfile.quality === "low" ? 90 : 220;
    const positions = new Float32Array(pointsCount * 3);

    for (let index = 0; index < pointsCount; index += 1) {
      const radius = 3.2 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 5.4;
      positions[index * 3 + 2] = Math.sin(angle) * radius - 1.6;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        color: 0xc7fff8,
        size: initialProfile.quality === "low" ? 0.03 : 0.02,
        transparent: true,
        opacity: 0.22,
      }),
    );
    rig.add(points);

    const keyLight = new THREE.PointLight(0xc9fff4, 65, 24);
    keyLight.position.set(4, 3, 6);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0x10eeb5, 45, 18);
    accentLight.position.set(-2, 1, 1);
    scene.add(accentLight);

    const ambient = new THREE.AmbientLight(0xb9f8ff, 0.38);
    scene.add(ambient);

    const resize = () => {
      const profile = getMotionPreference();
      renderer.setPixelRatio(profile.dpr);
      renderer.setSize(profile.width, profile.height, false);
      camera.aspect = profile.width / profile.height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize, { passive: true });

    const startTime = performance.now();
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const targetScale = new THREE.Vector3();
    const targetTile = new THREE.Vector3();
    const targetPosition = new THREE.Vector3();
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      pointer.set(event.clientX / innerWidth - 0.5, event.clientY / innerHeight - 0.5);
    }, { passive: true });
    document.addEventListener("pointerleave", () => pointer.set(0, 0));
    let lastTime = performance.now();
    let animationFrame = 0;
    let cachedChapter = "brand";
    let cachedProgress = 0;
    let cachedState = SCENE_STATE.brand;

    const syncChapterState = () => {
      cachedChapter = document.documentElement.dataset.activeChapter || "brand";
      cachedProgress = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--chapter-progress") || "0",
      );
      cachedState = SCENE_STATE[cachedChapter] || SCENE_STATE.brand;
    };

    const wakeRenderer = () => {
      if (!document.hidden && animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      animationFrame = 0;
      if (document.hidden) return;

      const elapsed = (performance.now() - startTime) / 1000;
      const activeChapter = document.documentElement.dataset.activeChapter || "brand";
      if (activeChapter !== cachedChapter) syncChapterState();
      const state = cachedState;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const ease = 1 - Math.exp(-3 * delta);
      smoothPointer.lerp(pointer, ease);

      camera.position.lerp(state.camera, ease);
      targetPosition.copy(state.cube);
      const narrow = innerWidth <= 640;
      if (narrow && activeChapter === "brand") targetPosition.set(0.1, 1.55, -0.5);
      targetPosition.y += Math.sin(elapsed * 0.65) * 0.1;
      cube.position.lerp(targetPosition, ease);
      const scale = narrow ? state.scale * 0.53 : state.scale;
      cube.scale.lerp(targetScale.setScalar(scale), ease);

      const rotateBoost = activeChapter === "services" || activeChapter === "pricing" ? 0.18 : 0.08;
      cube.rotation.y = elapsed * rotateBoost + 0.6 + smoothPointer.x * 0.35;
      cube.rotation.x = 0.24 + Math.sin(elapsed * 0.22) * 0.12 + smoothPointer.y * 0.2;
      cube.rotation.z = -0.12 + Math.sin(elapsed * 0.16) * 0.05;

      const corePulse = 1 + Math.sin(elapsed * 1.8) * 0.045;
      core.rotation.y = elapsed * -0.32;
      core.rotation.x = elapsed * 0.18;
      core.scale.setScalar(state.core * corePulse);
      const coreMaterial = core.material as THREE.MeshStandardMaterial;
      coreMaterial.emissiveIntensity += (1.5 - coreMaterial.emissiveIntensity) * ease;
      coreMaterial.opacity += (Math.min(0.94, 0.46 + state.core * 0.42) - coreMaterial.opacity) * 0.045;

      cubeTiles.forEach((tile, index) => {
        const pulse = Math.sin(elapsed * 1.2 + index * 0.37) * 0.025;
        const spread = state.spread + pulse;
        targetTile.copy(tile.tileHome).addScaledVector(tile.tileAxis, spread);
        tile.position.lerp(targetTile, ease);
        tile.material.emissiveIntensity += (state.emissive - tile.material.emissiveIntensity) * 0.04;
        tile.material.opacity += (Math.min(0.92, 0.62 + state.emissive * 0.24) - tile.material.opacity) * 0.04;
      });

      const beamMaterial = beams.material as THREE.LineBasicMaterial;
      beamMaterial.opacity += (activeChapter === "brand" ? 0.08 : state.rings * 0.28) - beamMaterial.opacity;
      beamMaterial.opacity = THREE.MathUtils.clamp(beamMaterial.opacity, 0.05, 0.34);
      beams.visible = activeChapter === "services";
      beams.rotation.y = elapsed * 0.05;
      beams.rotation.z = Math.sin(elapsed * 0.13) * 0.08;

      rings.forEach((ring, index) => {
        ring.rotation.z += delta * (0.04 + index * 0.015);
        ring.rotation.y += delta * 0.02;
        const material = ring.material as THREE.MeshBasicMaterial;
        const ringVisibilityScale = activeChapter === "brand" ? 0 : 0.07;
        material.opacity += (state.rings * ringVisibilityScale - material.opacity) * 0.035;
      });

      edge.visible = false;
      points.rotation.y = elapsed * -0.022;
      points.rotation.x = Math.sin(elapsed * 0.12) * 0.05;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(tick);
    };

    syncChapterState();
    document.documentElement.dataset.sceneReady = "true";
    document.addEventListener("visibilitychange", wakeRenderer);
    tick();
  } else {
    canvas.setAttribute("data-static", "true");
  }
}

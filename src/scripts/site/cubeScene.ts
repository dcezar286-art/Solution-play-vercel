/**
 * Cubo 3D Solution Play (desktop).
 * - Rolagem normal da página: o cubo muda de posição conforme a seção (data-scene) e gira com o scroll.
 * - 1 draw call para as peças (InstancedMesh), pixel ratio limitado e auto-ajuste de qualidade.
 * - Se o computador não aguentar, desliga sozinho e volta para o cubo em CSS.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  FogExp2,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type SceneState = {
  pos: [number, number, number];
  scale: number;
  spread: number;
  core: number;
  rings: number;
  glow: number;
};

/** Posições do cubo por seção. Ajuste aqui para mudar a "coreografia". */
const STATES: Record<string, SceneState> = {
  hero: { pos: [2.55, 0.05, 0], scale: 1.6, spread: 0.03, core: 1, rings: 0, glow: 0.55 },
  servicos: { pos: [3.6, 0.6, -3], scale: 1.15, spread: 0.6, core: 0.7, rings: 0.6, glow: 0.35 },
  base: { pos: [-3.2, 0.1, -1.6], scale: 1.25, spread: 0.22, core: 0.9, rings: 0.8, glow: 0.45 },
  atendimento: { pos: [0.4, 0.4, -5], scale: 1.6, spread: 0.95, core: 0.55, rings: 0.5, glow: 0.3 },
  contato: { pos: [0.2, 0.4, -6], scale: 2.3, spread: 0.06, core: 1.2, rings: 0.35, glow: 0.45 },
};

const GRID = [-1.5, -0.5, 0.5, 1.5];
const TILE = 0.32;
const GAP = 0.035;

export function mountCubeScene(canvas: HTMLCanvasElement) {
  const root = document.documentElement;
  const dprCap = Math.min(window.devicePixelRatio || 1, 1.5);
  let dpr = dprCap;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new Scene();
  scene.fog = new FogExp2(0x07111f, 0.06);
  const pmrem = new PMREMGenerator(renderer);
  const env = new RoomEnvironment();
  scene.environment = pmrem.fromScene(env, 0.04).texture;
  env.dispose();
  pmrem.dispose();

  const camera = new PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0.15, 8.2);

  /* ---------- Cubo (peças instanciadas) ---------- */
  const homes: Vector3[] = [];
  const axes: Vector3[] = [];
  GRID.forEach((x, xi) =>
    GRID.forEach((y, yi) =>
      GRID.forEach((z, zi) => {
        const edge = [xi, yi, zi].some((v) => v === 0 || v === GRID.length - 1);
        const carved = (xi === 1 && yi === 2 && zi === 0) || (xi === 2 && yi === 1 && zi === GRID.length - 1);
        if (!edge || carved) return;
        const home = new Vector3(x, y, z).multiplyScalar(TILE + GAP);
        homes.push(home);
        axes.push(home.clone().normalize());
      }),
    ),
  );

  const tileMaterial = new MeshStandardMaterial({
    color: 0x101b2c,
    emissive: new Color(0x1d9fd0),
    emissiveIntensity: 0.05,
    roughness: 0.24,
    metalness: 0.9,
    envMapIntensity: 1.7,
  });
  const tiles = new InstancedMesh(new RoundedBoxGeometry(TILE, TILE, TILE, 2, 0.045), tileMaterial, homes.length);
  const cube = new Group();
  cube.add(tiles);

  const coreMaterial = new MeshStandardMaterial({
    color: 0xf5ffff,
    emissive: 0x63f4ff,
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.7,
    transparent: true,
    opacity: 0.9,
  });
  const core = new Mesh(new OctahedronGeometry(0.5, 1), coreMaterial);
  cube.add(core);

  const rig = new Group();
  rig.add(cube);
  scene.add(rig);

  /* ---------- Anéis e partículas ---------- */
  const rings: Mesh[] = [0, 1].map((i) => {
    const ring = new Mesh(
      new TorusGeometry(2.1 + i * 0.45, 0.006, 8, 160),
      new MeshBasicMaterial({ color: 0x5fd6f0, transparent: true, opacity: 0, side: DoubleSide }),
    );
    ring.rotation.set(Math.PI / 2 + i * 0.24, i * 0.3, 0);
    cube.add(ring);
    return ring;
  });

  const count = 240;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 7;
    const a = Math.random() * Math.PI * 2;
    positions.set([Math.cos(a) * r, (Math.random() - 0.5) * 6, Math.sin(a) * r - 2], i * 3);
  }
  const pointsGeo = new BufferGeometry();
  pointsGeo.setAttribute("position", new BufferAttribute(positions, 3));
  const points = new Points(pointsGeo, new PointsMaterial({ color: 0xcfe9ff, size: 0.022, transparent: true, opacity: 0.28 }));
  scene.add(points);

  /* ---------- Brilho ---------- */
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const g = glowCanvas.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(51,201,234,0.55)");
  grad.addColorStop(0.35, "rgba(20,110,170,0.18)");
  grad.addColorStop(1, "rgba(0,40,80,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const glow = new Sprite(
    new SpriteMaterial({ map: new CanvasTexture(glowCanvas), transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.5 }),
  );
  glow.scale.set(8, 6, 1);
  scene.add(glow);

  /* ---------- Luzes ---------- */
  const key = new PointLight(0xd6f4ff, 60, 24);
  key.position.set(4, 3, 6);
  const accent = new PointLight(0x33c9ea, 40, 18);
  accent.position.set(-2, 1, 2);
  scene.add(key, accent, new AmbientLight(0xc4e4ff, 0.4));

  /* ---------- Interação ---------- */
  const pointer = new Vector2();
  const smooth = new Vector2();
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "mouse") pointer.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
    },
    { passive: true },
  );

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resize, { passive: true });

  /* ---------- Loop ---------- */
  const matrix = new Matrix4();
  const quat = new Quaternion();
  const one = new Vector3(1, 1, 1);
  const tmp = new Vector3();
  const target = new Vector3();
  const spreadNow = { value: STATES.hero.spread };
  let scrollSpin = 0;
  let last = performance.now();
  const start = last;
  let frame = 0;
  let running = true;

  // Auto-ajuste: mede o tempo dos quadros e reduz a qualidade se estiver pesado.
  let sampleCount = 0;
  let sampleTotal = 0;
  let downgrades = 0;

  const stop = (reason: string) => {
    running = false;
    cancelAnimationFrame(frame);
    delete root.dataset.cube3d;
    renderer.dispose();
    console.info(`[Solution Play] Cubo 3D desligado (${reason}). Usando versão leve.`);
  };

  canvas.addEventListener("webglcontextlost", () => stop("contexto perdido"));

  const tick = () => {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (document.hidden) return;

    const now = performance.now();
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = (now - start) / 1000;
    const ease = 1 - Math.exp(-2.6 * delta);

    const state = STATES[root.dataset.scene || "hero"] || STATES.hero;

    smooth.lerp(pointer, ease);
    scrollSpin += ((window.scrollY / Math.max(innerHeight, 1)) * 0.9 - scrollSpin) * ease;

    // Ajusta posição/tamanho ao formato da tela (notebooks 4:3 ou 16:10 vs. monitores largos).
    const fit = MathUtils.clamp(camera.aspect / 1.78, 0.75, 1.15);
    target.set(state.pos[0] * fit, state.pos[1], state.pos[2]);
    target.y += Math.sin(t * 0.65) * 0.08;
    cube.position.lerp(target, ease);
    const s = MathUtils.lerp(cube.scale.x, state.scale * Math.min(1, 0.35 + fit * 0.65), ease);
    cube.scale.setScalar(s);

    cube.rotation.y = 0.6 + t * 0.07 + scrollSpin + smooth.x * 0.35;
    cube.rotation.x = 0.26 + Math.sin(t * 0.22) * 0.1 + smooth.y * 0.2 + scrollSpin * 0.15;
    cube.rotation.z = -0.1 + Math.sin(t * 0.16) * 0.05;

    spreadNow.value += (state.spread - spreadNow.value) * ease;
    for (let i = 0; i < homes.length; i++) {
      const pulse = Math.sin(t * 1.2 + i * 0.37) * 0.02;
      tmp.copy(homes[i]).addScaledVector(axes[i], spreadNow.value + pulse);
      matrix.compose(tmp, quat, one);
      tiles.setMatrixAt(i, matrix);
    }
    tiles.instanceMatrix.needsUpdate = true;

    core.rotation.set(t * 0.18, t * -0.32, 0);
    core.scale.setScalar(MathUtils.lerp(core.scale.x, state.core * (1 + Math.sin(t * 1.8) * 0.04), ease));

    rings.forEach((ring, i) => {
      ring.rotation.z += delta * (0.05 + i * 0.02);
      const m = ring.material as MeshBasicMaterial;
      m.opacity += (state.rings * 0.12 - m.opacity) * ease;
    });

    glow.position.set(cube.position.x + 0.4, cube.position.y + 0.3, cube.position.z - 2.5);
    const gm = glow.material as SpriteMaterial;
    gm.opacity += (state.glow - gm.opacity) * ease;

    points.rotation.y = t * -0.02 + scrollSpin * 0.2;

    renderer.render(scene, camera);

    // Mede desempenho nos primeiros segundos e depois de forma contínua.
    sampleTotal += delta;
    sampleCount++;
    if (sampleCount === 90) {
      const avg = sampleTotal / sampleCount;
      sampleCount = 0;
      sampleTotal = 0;
      if (avg > 1 / 30) {
        downgrades++;
        if (downgrades === 1 && dpr > 1) {
          dpr = 1;
          renderer.setPixelRatio(dpr);
          resize();
        } else if (downgrades >= 2) {
          stop("desempenho baixo");
        }
      }
    }

    if (root.dataset.cube3d !== "on") root.dataset.cube3d = "on";
  };

  // Começa já na posição da seção atual (sem "voar" por cima do texto).
  {
    const initial = STATES[root.dataset.scene || "hero"] || STATES.hero;
    const fit = MathUtils.clamp(camera.aspect / 1.78, 0.75, 1.15);
    cube.position.set(initial.pos[0] * fit, initial.pos[1], initial.pos[2]);
    cube.scale.setScalar(initial.scale * Math.min(1, 0.35 + fit * 0.65));
    spreadNow.value = initial.spread;
  }

  tick();
}

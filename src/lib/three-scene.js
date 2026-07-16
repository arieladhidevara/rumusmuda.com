import * as THREE from 'three';

/**
 * Fullscreen background scene in the Hubtown style: a noise-displaced
 * wireframe terrain glowing from deep blue to periwinkle, with a slow
 * field of rising particles. Scroll progress (0..1 across the hero)
 * pushes the camera down toward the grid and raises the noise amplitude.
 */

const SIMPLEX_3D = /* glsl */ `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const TERRAIN_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;

  varying float vElevation;
  varying vec2 vPlane;

  ${SIMPLEX_3D}

  void main() {
    vec3 p = position;
    float broad = snoise(vec3(p.x * 0.32, p.y * 0.32 + uTime * 0.35, uTime * 0.25));
    float fine = snoise(vec3(p.x * 0.95 + 10.0, p.y * 0.95 + uTime * 0.6, uTime * 0.4)) * 0.35;
    float e = (broad + fine) * uAmp;
    p.z += e;

    vElevation = e;
    vPlane = position.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const TERRAIN_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uAmp;

  varying float vElevation;
  varying vec2 vPlane;

  void main() {
    float h = smoothstep(-0.9 * uAmp, 1.1 * uAmp, vElevation);
    vec3 col = mix(uColorA, uColorB, h);

    float dist = length(vPlane);
    float fade = 1.0 - smoothstep(2.2, 6.6, dist);

    gl_FragColor = vec4(col, fade * uOpacity);
  }
`;

const POINTS_VERTEX = /* glsl */ `
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;

  void main() {
    vec3 p = position;
    float travel = mod(p.y + uTime * aSpeed, 4.2);
    p.y = travel;
    p.x += sin(uTime * 0.4 + aOffset) * 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = min(aScale * uPixelRatio * (30.0 / -mvPosition.z), 26.0 * uPixelRatio);

    /* fade out near the top and bottom of the travel band */
    vAlpha = smoothstep(0.0, 0.6, travel) * (1.0 - smoothstep(3.2, 4.2, travel));
  }
`;

const POINTS_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float disc = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(uColor, disc * vAlpha * uOpacity);
  }
`;

export class RumusScene {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.progress = 0;
    this.pointer = { x: 0, y: 0 };
    this.pointerTarget = { x: 0, y: 0 };
    this.velocity = 0;
    this.velocityTarget = 0;
    this.elapsed = 0;
    this.rafId = 0;
    this.disposed = false;

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      this.renderer = null;
      return;
    }

    this.renderer.setClearColor(0x020a19, 0);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 40);
    this.camera.position.set(0, 1.1, 3.6);

    this.buildTerrain();
    this.buildPoints();

    this.clock = new THREE.Clock();

    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove);

    this.onResize();

    if (this.reducedMotion) {
      this.renderFrame(0);
    } else {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  buildTerrain() {
    const geometry = new THREE.PlaneGeometry(14, 14, 110, 110);
    this.terrainMaterial = new THREE.ShaderMaterial({
      vertexShader: TERRAIN_VERTEX,
      fragmentShader: TERRAIN_FRAGMENT,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.5 },
        uColorA: { value: new THREE.Color('#052261').multiplyScalar(1.6) },
        uColorB: { value: new THREE.Color('#1cc9f4').multiplyScalar(0.55) },
        uOpacity: { value: 0.85 },
      },
    });

    this.terrain = new THREE.Mesh(geometry, this.terrainMaterial);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.position.y = -0.4;
    this.scene.add(this.terrain);
  }

  buildPoints() {
    const count = 420;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = Math.random() * 4.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      scales[i] = 1 + Math.random() * 2.2;
      speeds[i] = 0.04 + Math.random() * 0.1;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));

    this.pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: POINTS_VERTEX,
      fragmentShader: POINTS_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color('#1cc9f4') },
        uOpacity: { value: 0.65 },
      },
    });

    this.points = new THREE.Points(geometry, this.pointsMaterial);
    this.points.position.y = -0.4;
    this.scene.add(this.points);
  }

  /** p: 0..1 scroll progress across the hero — dives the camera into the grid. */
  setProgress(p) {
    this.progress = p;
    if (this.reducedMotion && this.renderer) this.renderFrame(0);
  }

  /** v: scroll speed in px/s — fast scrolling makes the terrain churn harder. */
  setVelocity(v) {
    this.velocityTarget = v;
  }

  onPointerMove(event) {
    this.pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
  }

  onResize() {
    if (!this.renderer) return;
    const { clientWidth, clientHeight } = this.canvas;
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.pointsMaterial.uniforms.uPixelRatio.value = dpr;
    if (this.reducedMotion) this.renderFrame(0);
  }

  renderFrame(delta) {
    const p = this.progress;

    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * Math.min(delta * 4, 1);
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * Math.min(delta * 4, 1);
    this.velocity += (this.velocityTarget - this.velocity) * Math.min(delta * 3, 1);

    /* fast scrolling churns the noise field and lifts the waves */
    const boost = Math.min(Math.abs(this.velocity) / 1600, 1);
    this.elapsed += delta * (1 + boost * 2.4);

    this.camera.position.x = this.pointer.x * 0.35;
    this.camera.position.y = 1.1 + p * 1.1 - this.pointer.y * 0.15;
    this.camera.position.z = 3.6 - p * 0.7;
    this.camera.lookAt(0, 0.15 - p * 0.35, 0);

    this.terrainMaterial.uniforms.uTime.value = this.elapsed * 0.28;
    this.terrainMaterial.uniforms.uAmp.value = (0.5 + p * 0.75) * (1 + boost * 0.35);
    this.pointsMaterial.uniforms.uTime.value = this.elapsed;

    this.renderer.render(this.scene, this.camera);
  }

  tick() {
    if (this.disposed) return;
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.renderFrame(delta);
    this.rafId = requestAnimationFrame(this.tick);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    if (!this.renderer) return;
    this.terrain.geometry.dispose();
    this.terrainMaterial.dispose();
    this.points.geometry.dispose();
    this.pointsMaterial.dispose();
    this.renderer.dispose();
  }
}

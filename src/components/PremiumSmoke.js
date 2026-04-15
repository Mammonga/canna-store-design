import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERT = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uBrightness;
  uniform float uCurlAmount;
  uniform float uThickness;
  uniform float uDrift;
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  uniform vec3 uColorHaze;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec2 hash2(vec2 p) {
    return vec2(
      hash(p + vec2(17.0, 3.1)),
      hash(p + vec2(29.7, 11.3))
    );
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.02 + vec2(6.7, 3.9);
      amplitude *= 0.52;
    }

    return value;
  }

  float warpedFbm(vec2 p, float strength) {
    vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(4.8, 1.7)));
    vec2 r = vec2(fbm(p + q * strength + vec2(1.2, 9.1)), fbm(p + q * strength + vec2(8.3, 2.4)));
    return fbm(p + r * strength);
  }

  float ribbonMask(vec2 uv, float centerY, float thickness) {
    float driftY = 0.012 * sin(uTime * 0.08) + 0.008 * sin(uTime * 0.05 + 1.8);
    float dy = uv.y - (centerY + driftY);
    float upper = thickness * 0.88;
    float lower = thickness * 1.3;
    float sigma = dy > 0.0 ? upper : lower;
    float mask = exp(-0.5 * (dy * dy) / (sigma * sigma));
    mask *= smoothstep(0.02, 0.13, uv.x);
    mask *= mix(1.0, 0.82, smoothstep(0.86, 1.0, uv.x));
    return mask;
  }

  float wisps(vec2 uv, float t, float baseMask) {
    float layer = 0.0;

    vec2 aUv = uv + vec2(-t * 0.004, -t * 0.013);
    float a = fbm(aUv * vec2(3.6, 6.4) + vec2(0.0, t * 0.04));
    layer += a * exp(-pow((uv.x - 0.42) / 0.11, 2.0)) * smoothstep(0.54, 0.76, uv.y) * 0.34;

    vec2 bUv = uv + vec2(-t * 0.006, -t * 0.018);
    float b = fbm(bUv * vec2(4.2, 7.0) + vec2(3.0, t * 0.05));
    layer += b * exp(-pow((uv.x - 0.63) / 0.08, 2.0)) * smoothstep(0.56, 0.8, uv.y) * 0.28;

    vec2 cUv = uv + vec2(-t * 0.003, -t * 0.02);
    float c = fbm(cUv * vec2(3.0, 7.4) + vec2(6.5, t * 0.03));
    layer += c * exp(-pow((uv.x - 0.8) / 0.06, 2.0)) * smoothstep(0.52, 0.72, uv.y) * 0.18;

    return clamp(layer * baseMask, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed;
    float rightBias = smoothstep(0.12, 0.72, uv.x);
    float curl = mix(0.2, uCurlAmount, rightBias);

    vec2 flowUv = uv;
    flowUv.x -= t * uDrift;
    flowUv.y += 0.005 * sin(t * 0.35 + uv.x * 2.0);

    float warpA = warpedFbm(flowUv * vec2(1.7, 2.7) + vec2(t * 0.05, 0.0), curl);
    float warpB = warpedFbm(flowUv * vec2(2.4, 3.2) + vec2(4.0 + t * 0.03, t * 0.015), curl * 0.75);
    float detail = fbm(flowUv * vec2(3.4, 4.8) + vec2(8.0 + t * 0.07, t * 0.02));

    float density = warpA * 0.52 + warpB * 0.3 + detail * 0.18;
    float mask = ribbonMask(uv, 0.48, uThickness);
    float smoke = smoothstep(0.18, 0.8, density * mask);
    float wisp = wisps(uv, t, mask) * 0.65;

    float haze = smoothstep(0.04, 0.4, smoke + wisp);
    float mid = smoothstep(0.24, 0.66, smoke);
    float core = smoothstep(0.54, 0.9, smoke);

    vec3 color = vec3(0.0);
    color = mix(color, uColorHaze * 0.74, haze);
    color = mix(color, uColorMid, mid);
    color = mix(color, uColorCore, core);
    color = mix(color, vec3(0.86, 1.0, 0.9), smoothstep(0.78, 1.0, smoke) * 0.34);

    float alpha = haze * uOpacity * uBrightness;
    alpha *= smoothstep(0.0, 0.06, uv.x);
    alpha *= smoothstep(0.0, 0.18, 1.0 - abs(uv.y - 0.48) / 0.52);

    gl_FragColor = vec4(color, alpha);
  }
`;

function SmokePlane({
  speed = 0.16,
  opacity = 0.8,
  brightness = 1.02,
  curlAmount = 0.74,
  thickness = 0.1,
  drift = 0.024,
  colorCore = [0.49, 1.0, 0.556],
  colorMid = [0.341, 0.847, 0.427],
  colorHaze = [0.18, 0.561, 0.278],
}) {
  const materialRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uOpacity: { value: opacity },
      uBrightness: { value: brightness },
      uCurlAmount: { value: curlAmount },
      uThickness: { value: thickness },
      uDrift: { value: drift },
      uColorCore: { value: new THREE.Vector3(...colorCore) },
      uColorMid: { value: new THREE.Vector3(...colorMid) },
      uColorHaze: { value: new THREE.Vector3(...colorHaze) },
    }),
    [brightness, colorCore, colorHaze, colorMid, curlAmount, drift, opacity, speed, thickness]
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={4}
          array={new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0])}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={4}
          array={new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])}
          itemSize={2}
        />
        <bufferAttribute attach="index" count={6} array={new Uint16Array([0, 1, 2, 0, 2, 3])} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

function PremiumSmoke({ className, style, speed, opacity, brightness, curlAmount, thickness, drift }) {
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') {
      return 1.75;
    }

    const deviceDpr = window.devicePixelRatio || 1;
    return Math.min(Math.max(deviceDpr, 1.6), 2);
  }, []);

  return (
    <div className={className} style={{ pointerEvents: 'none', ...style }}>
      <Canvas
        dpr={dpr}
        frameloop="always"
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ manual: true }}
      >
        <SmokePlane
          speed={speed}
          opacity={opacity}
          brightness={brightness}
          curlAmount={curlAmount}
          thickness={thickness}
          drift={drift}
        />
      </Canvas>
    </div>
  );
}

export default PremiumSmoke;

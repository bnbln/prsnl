// components/HeroB.tsx

import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function SceneHero() {
  const { nodes } = useGLTF('/models/B.glb') as any
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const scroll = useScroll()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.3
      meshRef.current.rotation.x = scroll.offset * Math.PI * 2
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
    }
  })

  if (!nodes?.Text?.geometry) {
    return null
  }

  return (
    <mesh ref={meshRef} geometry={nodes.Text.geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// 🌊 Simplex Noise + Displacement
const noise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 x = fract(p * C.w) * 2.0 - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  vec2 g0 = vec2(a0.x, h.x);
  vec2 g1 = vec2(a0.y, h.y);
  vec2 g2 = vec2(a0.z, h.z);
  float t0 = 0.5 - dot(x0,x0);
  float t1 = 0.5 - dot(x12.xy,x12.xy);
  float t2 = 0.5 - dot(x12.zw,x12.zw);
  float n0 = (t0 < 0.0) ? 0.0 : pow(t0, 4.0) * dot(g0, x0);
  float n1 = (t1 < 0.0) ? 0.0 : pow(t1, 4.0) * dot(g1, x12.xy);
  float n2 = (t2 < 0.0) ? 0.0 : pow(t2, 4.0) * dot(g2, x12.zw);
  return 70.0 * (n0 + n1 + n2);
}
`

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying float vDistort;

float noise(vec2 p) {
  return sin(p.x * 10.0) * 0.5 + sin(p.y * 10.0 + uTime) * 0.5;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float sliceOffset = step(0.1, fract(pos.y * 5.0 + uTime * 0.5)) * 0.05;
  pos.z += sliceOffset;
  float n = noise(pos.xy + uTime * 0.5);
  pos.z += n * 0.1;
  vDistort = n;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying float vDistort;

void main() {
  float glow = smoothstep(0.2, 0.8, vUv.y + vDistort * 0.4);
  vec3 colorA = vec3(1.0, 0.2, 0.2);
  vec3 colorB = vec3(1.0, 0.8, 0.3);
  vec3 color = mix(colorA, colorB, vUv.y + vDistort);
  color *= glow;

  gl_FragColor = vec4(color, glow);
}
`
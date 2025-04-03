// https://twitter.com/lusionltd/status/1701534187545636964
// https://lusion.co

import * as THREE from 'three'
import { useRef, useReducer, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { easing } from 'maath'

const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00']
const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: accents[accent], roughness: 0.1, accent: true }
]

const modelPaths = ['/models/B.glb', '/models/E.glb', '/models/N.glb']

export function Corners() {
  return (
    <div style={{ 
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0
    }}>
    <Scene />
    <div style={{ background: 'linear-gradient(to top, #000000, transparent)', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />

    </div>
  )
}

function Scene(props) {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <Canvas 
    onClick={click} 
    shadows 
    dpr={[1, 1.5]} 
    gl={{
        antialias: false,
        preserveDrawingBuffer: true,
        alpha: true,
        stencil: false,
        powerPreference: "high-performance",
      }}
      performance={{ 
        min: 0.5,  // Minimum frame rate before quality reduction
        max: 1,    // Maximum frame rate to maintain
        debounce: 100 // Debounce time for quality adjustments
      }}
    camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }} 
    {...props}>
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics /*debug*/ gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => <Connector key={i} {...props} />) /* prettier-ignore */}
        <Connector position={[10, 10, 5]}>
          <Model>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
          </Model>
        </Connector>
      </Physics>
      <EffectComposer>
        <N8AO
          blendFunction={BlendFunction.MULTIPLY}
          samples={5}
          intensity={2}
          aoRadius={1}
          distanceFalloff={1}
        />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  )
}

function Connector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef()
  const pos = useMemo(() => position || [r(15), r(15), r(15)], [position, r])
  const modelIndex = useMemo(() => Math.floor(Math.random() * modelPaths.length), [])

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(0.1)
    )
  })
  return (
    <RigidBody 
      linearDamping={5}
      angularDamping={2}
      friction={0.2}
      restitution={0.2}
      position={pos} 
      ref={api} 
      colliders={false}
    >
      <CuboidCollider args={[0.3, 0.7, 0.3]} />
      <CuboidCollider args={[0.7, 0.3, 0.3]} />
      <CuboidCollider args={[0.3, 0.3, 0.7]} />
      {children ? children : <Model {...props} modelIndex={modelIndex} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function Model({ children, color = 'white', roughness = 0, modelIndex, ...props }) {
  const ref = useRef()
  const { nodes } = useGLTF(modelPaths[modelIndex ?? 0])
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, roughness);
    shape.absarc(roughness, roughness, roughness, Math.PI, Math.PI / 2, true);
    shape.absarc(1 - roughness, roughness, roughness, Math.PI / 2, 0, true);
    shape.absarc(1 - roughness, 1 - roughness, roughness, 0, -Math.PI / 2, true);
    shape.absarc(roughness, 1 - roughness, roughness, -Math.PI / 2, -Math.PI, true);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.01,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [roughness]);

  const memoizedPosition = useMemo(() => props.position || [0, 0, 0], [props.position]);

  return (
    <mesh ref={ref} castShadow receiveShadow scale={1} geometry={geometry} position={memoizedPosition}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} color={color} />
      {children}
    </mesh>
  )
}

import React, { useState, useEffect, useCallback, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, useTexture, Shadow, meshBounds } from "@react-three/drei"
// We take the "a" element from /three here because we want to animate threejs objects
import { a as web, useSpring as useWebSpring } from "@react-spring/web"
import { a as three, useSpring } from "@react-spring/three"

function Switch({ x, set }) {
  const { nodes, materials } = useGLTF("/models/switch.glb")
  const texture = useTexture("/models/cross.jpg")
  // Hover state
  const [hovered, setHover] = useState(false)
  useEffect(() => void (document.body.style.cursor = hovered ? "pointer" : "auto"), [hovered])
  // Events
  const onClick = useCallback(() => {
    console.log('Switch clicked, current x:', x);
    set(prev => {
      const newValue = prev === 0 ? 1 : 0;
      console.log('Setting new value:', newValue);
      return newValue;
    });
  }, [set, x]);
  const onPointerOver = useCallback(() => setHover(true), [])
  const onPointerOut = useCallback(() => setHover(false), [])
  // Interpolations
  const pZ = x.to([0, 1], [-1.2, 1.2])
  const rX = x.to([0, 1], [0, Math.PI * 1.3])
  const color = x.to([0, 1], ["#888", "#2a2a2a"])
  return (
    <group scale={[1.25, 1.25, 1.25]} dispose={null}>
      <three.mesh receiveShadow castShadow material={materials.track} geometry={nodes.Cube.geometry} material-color={color} material-roughness={0.5} material-metalness={0.8} />
      <three.group position-y={0.85} position-z={pZ}>
        <three.mesh receiveShadow castShadow raycast={meshBounds} rotation-x={rX} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <three.meshStandardMaterial roughness={0.5} map={texture} />
        </three.mesh>
        <three.pointLight intensity={100} distance={1.4} color={color} />
        <Shadow renderOrder={-1000} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5} />
      </three.group>
    </group>
  )
}

 function Scene({ x, set }) {
  // Create a color interpolation
  const color = x.to([0, 1], ["#7fffd4", "#c72f46"])
  return (
    <Canvas 
    gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: true,
        stencil: false,
        powerPreference: "high-performance",
      }}
      performance={{ 
        min: 0.5,  // Minimum frame rate before quality reduction
        max: 1,    // Maximum frame rate to maintain
        debounce: 200 // Debounce time for quality adjustments
      }}
    orthographic 
    shadows dpr={[1, 2]} camera={{ zoom: 60, position: [-10, 10, 10], fov: 35 }} frameloop="demand">
      <ambientLight intensity={0.1} />
      <directionalLight position={[-20, 20, 20]} intensity={1} />
      <three.directionalLight position={[-20, -20, -20]} intensity={0.5} color={color} />
      <three.pointLight position={[0, 0, 5]} distance={5} intensity={5} color={color} />
      <three.spotLight color={color} position={[10, 20, 20]} angle={0.1} intensity={2} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.00001} castShadow />
      <Suspense fallback={null}>
        <Switch x={x} set={set} />
      </Suspense>
      <mesh receiveShadow renderOrder={1000} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <three.shadowMaterial transparent opacity={x.to((x) => 0.1 + x * 0.2)} />
      </mesh>
    </Canvas>
  )
}

export default function MyCanvas() {
    const [toggle, set] = useState(0)
    const springs = useSpring({
        from: { x: 0 },
        to: { x: toggle },
        config: { 
            mass: 5, 
            tension: 1000, 
            friction: 50, 
            precision: 0.0001 
        },
        onChange: (props) => {
            console.log("Spring value changed:", props.value.x)
        }
    })

    return (
        <div className="scene">
          <web.div 
            className="container" 
            style={{ 
              backgroundColor: springs.x.to([0, 1], ["#07885d", "#ff2558"]), 
              color: springs.x.to([0, 1], ["#7fffd4", "#c70f46"]), 
              height: '100vh' 
            }}
          >
            <h1 className="open">&lt;h1&gt;</h1>
            <h1 className="close">&lt;/h1&gt;</h1>
            <web.h1>{springs.x.to((x) => (x + 8).toFixed(2))}</web.h1>
            <Scene x={springs.x} set={set} />
          </web.div>
        </div>
    )
}
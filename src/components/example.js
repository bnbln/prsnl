import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Float, Lightformer, Text, Html, ContactShadows, Environment, MeshTransmissionMaterial } from "@react-three/drei"
import { Bloom, EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing"
import { suspend } from "suspend-react"
import { easing } from "maath"

//const inter = import("/fonts/helvetiker_regular.json")

export const Example = () => (
  <>
    <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
      <color attach="background" args={["#e0e0e0"]} />
      <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />
      {/* <Status position={[0, 0, -10]} /> */}
      <Text fontSize={14} letterSpacing={-0.025} font="/fonts/helvetiker_regular.json" color="black">
      Design
      <Html style={{ color: "transparent", fontSize: "33.5em" }} transform>
        Design
      </Html>
    </Text>
      <Float floatIntensity={2}>
      <Knot />
      <Torus />
      </Float>
      <ContactShadows scale={100} position={[0, -7.5, 0]} blur={1} far={100} opacity={0.85} />
      <Environment preset="city">
        <Lightformer intensity={8} position={[10, 5, 0]} scale={[10, 50, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      <EffectComposer disableNormalPass>
        <N8AO aoRadius={1} intensity={2} />
        <Bloom mipmapBlur luminanceThreshold={0.8} intensity={2} levels={8} />
        <TiltShift2 blur={0.2} />
      </EffectComposer>
      <Rig />
    </Canvas>
  </>
)

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [Math.sin(-state.pointer.x) * 5, state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10],
      0.2,
      delta,
    )
    state.camera.lookAt(0, 0, 0)
  })
}

const Drop = (props) => (
  <mesh>
    <sphereGeometry args={[1, 64, 64]} />
    <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} />
  </mesh>
)

const Torus = (props) => (
  <mesh receiveShadow castShadow {...props}>
    <torusGeometry args={[4, 1.2, 128, 64]} />
    <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} />
  </mesh>
)

const Knot = (props) => (
  <mesh receiveShadow castShadow {...props}>
    <torusKnotGeometry args={[3, 1, 256, 32]} />
    <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} />
  </mesh>
)

function Status(props) {
  const [loc] = useLocation()
  const text = loc === "/" ? "/knot" : loc
  return (
    <Text fontSize={14} letterSpacing={-0.025} font={suspend(inter).default} color="black" {...props}>
      {text}
      <Html style={{ color: "transparent", fontSize: "33.5em" }} transform>
        {text}
      </Html>
    </Text>
  )
}

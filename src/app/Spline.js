import { useBreakpointValue } from '@chakra-ui/react'
import { Canvas } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import { Environment, Lightformer, OrbitControls, PivotControls, Text, Html } from '@react-three/drei'
import useSpline from '@splinetool/r3f-spline'
// import { useControls } from 'leva'

export default function Spline() {
  return (
    <Canvas orthographic camera={{ position: [6, 0, 10], near: 0.01, far: 1000, zoom: useBreakpointValue({base: "20", sm: "35", md: "50", xl: "55"}) }}>
      <color attach="background" args={['#fef4ef']} />
      <ambientLight />
      <directionalLight castShadow intensity={0.6} position={[0, 0, 10]} />
      <Html castShadow receiveShadow transform rotation={[0, 0, 0]} center position={[12, -6, 1.3]}>
        {/* <div style={{
          
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 100,
          fontSize: 130,
          width: "700px",
          lineHeight: 0.9,
          opacity: 1,
          zIndex: 900
        }}>
          BenediktSchnupp
        </div> */}
      </Html>
      <Scene scale={0.025} />

      <OrbitControls
        makeDefault 
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        minZoom={20}
        maxZoom={70}
        zoomSpeed={0.25}
        panSpeed={0.5}
        />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment>
    </Canvas>
  )
}

/*
  Auto-generated by Spline
*/
export function Scene({ ...props }) {
  // const myConfig = useControls({
  //   backside: false,
  //   samples: { value: 16, min: 1, max: 32, step: 1 },
  //   resolution: { value: 256, min: 64, max: 2048, step: 64 },
  //   transmission: { value: 0.95, min: 0, max: 1 },
  //   roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
  //   clearcoat: { value: 0.1, min: 0, max: 1, step: 0.01 },
  //   clearcoatRoughness: { value: 0.1, min: 0, max: 1, step: 0.01 },
  //   thickness: { value: 200, min: 0, max: 200, step: 0.01 },
  //   backsideThickness: { value: 200, min: 0, max: 200, step: 0.01 },
  //   ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
  //   chromaticAberration: { value: 1, min: 0, max: 1 },
  //   anisotropy: { value: 1, min: 0, max: 10, step: 0.01 },
  //   distortion: { value: 0, min: 0, max: 1, step: 0.01 },
  //   distortionScale: { value: 0.2, min: 0.01, max: 1, step: 0.01 },
  //   temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
  //   attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
  //   attenuationColor: '#ffffff',
  //   color: '#ffffff',
  // })
  const config = {
    backside: false,
    samples: 16,
    resolution: 256,
    transmission: 0.95,
    roughness: 0.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    thickness: 200,
    backsideThickness: 200,
    ior: 1.5,
    chromaticAberration: 1,
    anisotropy: 1,
    distortion: 0,
    distortionScale: 0.2,
    temporalDistortion: 0,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: '#ffffff',
  }
  return (
    <>
      <group {...props}>
        {/* <PivotControls scale={200} activeAxes={[true, true, false]} offset={[0, 0, 100]}>
          
        </PivotControls> */}
        <Shape name="Torus" float={0} color="#fef4ef" config={config} />
        <Shape name="Rectangle 6" color="#FF718F" config={config} position={[-700.64, 343.77, -621.72]} />
        <Shape name="Rectangle 5" color="#29C1A2" config={config} position={[-458.87, 411.05, -435.92]} />
        <Shape name="Rectangle 4" color="#FF9060" config={config} position={[0.66, 47, -435.92]} />
        <Shape name="Rectangle 3" color="#823FFF" config={config} position={[-348.74, -162.23, -167.36]} />
        <Shape name="Rectangle 2" color="skyblue" config={config} position={[242.6, 207, -273.39]} />
      </group>
    </>
  )
}

function Shape({ name, float = 300, color, config, ...props }) {
  const { nodes } = useSpline('/shapes.splinecode')
  return (
    <Float floatIntensity={float} rotationIntensity={0} speed={2}>
      <mesh renderOrder={100} geometry={nodes[name].geometry} {...props}>
        <MeshTransmissionMaterial {...config} color={color} toneMapped={false} />
      </mesh>
    </Float>
  )
}

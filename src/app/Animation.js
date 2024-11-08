/*
  Auto-generated by Spline
*/
import { Canvas } from '@react-three/fiber'
/*
  Auto-generated by Spline
*/

import useSpline from '@splinetool/r3f-spline'
import { OrthographicCamera } from '@react-three/drei'

export function Scene({ ...props }) {
  const { nodes, materials } = useSpline('https://prod.spline.design/5japJ1mv7TyO7LG9/scene.splinecode')
  return (
    <>
      <color attach="background" args={['#e2eefc']} />
      <fog attach="fog" args={['#e2eefc', 1200, 2000]} />
      <group {...props} dispose={null}>
        <scene name="Scene">
          <mesh
            name="Cube"
            geometry={nodes.Cube.geometry}
            material={materials['Cube Material']}
            castShadow
            receiveShadow
            position={[0, 70.8, 0]}
            scale={1.17}
          />
          <mesh
            name="Rectangle"
            geometry={nodes.Rectangle.geometry}
            material={materials.玻璃}
            castShadow
            receiveShadow
            position={[0, 45, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={1}
          />
          <mesh
            name="Rectangle1"
            geometry={nodes.Rectangle1.geometry}
            material={materials['Rectangle1 Material']}
            castShadow
            receiveShadow
            position={[0, 0, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={1}
          />
          <mesh
            name="地面"
            geometry={nodes.地面.geometry}
            material={materials['地面 Material']}
            castShadow
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <OrthographicCamera
            name="Camera"
            makeDefault={true}
            zoom={2}
            far={100000}
            near={-100000}
            position={[-448.4, 522.64, 742.85]}
            rotation={[-0.54, -0.48, -0.27]}
            scale={1}
          />
          <directionalLight
            name="Directional Light"
            castShadow
            intensity={0.7}
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-near={-10000}
            shadow-camera-far={100000}
            shadow-camera-left={-1000}
            shadow-camera-right={1000}
            shadow-camera-top={1000}
            shadow-camera-bottom={-1000}
            position={[-745.57, 560.23, 363.39]}
          />
          <OrthographicCamera name="1" makeDefault={false} far={10000} near={-50000} />
          <hemisphereLight name="Default Ambient Light" intensity={0.75} color="#eaeaea" />
        </scene>
      </group>
    </>
  )
}



export default function MyCanvas({ ...props }) {
    return(
        <Canvas style={{height:"65vh"}}>
             <color attach="background" args={['#000000']} />
             <Scene scale={0.8} />
        </Canvas>
    )
}
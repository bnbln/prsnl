'use client'
import { useRef, useState } from 'react'
import { Link } from '@chakra-ui/next-js'
import { Stats, OrbitControls, Circle } from '@react-three/drei'
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import Image from 'next/image'
import styles from './page.module.css'
import Comp from './Comp'
import Spline from './Spline'
import {Overlay} from './Overlay'

function Box(props) {
  // const gltf = useLoader(GLTFLoader, './models/zeitgeist.gltf')
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
    <primitive
        {...props}
        object={gltf.scene}
        ref={ref}
        scale={clicked ? 30 : 15}
        rotationY={30}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        onPointerOut={(event) => hover(false)}

        // children-0-castShadow
      >
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </primitive>
    </>
  )
}

export default function Home() {
  // const gltf = useLoader(GLTFLoader, './models/zeitgeist.gltf')
  return (
    <main className={styles.scene}>
      {/* <Comp></Comp> */}
      <Spline></Spline>
      <Overlay></Overlay>
    </main>
  )
}

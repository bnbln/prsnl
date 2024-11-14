import { useColorMode } from '@chakra-ui/react'
import { useFrame } from '@react-three/fiber'
import { Text3D, useGLTF } from '@react-three/drei'
import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { Group, MeshPhysicalMaterial } from 'three'
import { animate, useSpring } from 'framer-motion'
import { useControls } from 'leva'

// Add type for the GLTF result
type GLTFResult = {
  nodes: {
    Shape: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
  }
  materials: {
    [key: string]: THREE.Material
  }
}

const ScrollText: React.FC = () => {
  const { colorMode } = useColorMode()
  const textRef = useRef<Group>(null)
  const codeRef = useRef<Group>(null)
  const designRef = useRef<Group>(null)
  const batRef = useRef<Group>(null)

  // Load the bat model
  const { nodes } = useGLTF('/models/bat.gltf') as unknown as GLTFResult

  // Create spring animations for each text element
  const codeSpring = useSpring(-1.3, { damping: 20, stiffness: 20, mass: 20, velocity: 0.2 })
  const designSpring = useSpring(1, { damping: 20, stiffness: 20, mass: 20, velocity: 0.2 })
  const positionDesignSpring = useSpring(-20, { damping: 20, stiffness: 80, mass: 5, velocity: -1 })
  const positionCodeSpring = useSpring(-20, { damping: 20, stiffness: 80, mass: 5, velocity: -1 })
  const scaleSpring = useSpring(1, { damping: 20, stiffness: 20, mass: 20, velocity: 2 })    

  useEffect(() => {
    // Stagger the animations
    const codeAnimation = animate(codeSpring, 0, {
      duration: 1,
      delay: 0
    })
    
    const designAnimation = animate(designSpring, 0, {
      duration: 1,
      delay: 0
    })
    const positionAnimationDesign = animate(positionDesignSpring, 2.85, {
      duration: 1,
      delay: 0
    })
    const positionAnimationCode = animate(positionCodeSpring, 1, {
        duration: 1,
        delay: 0.1
      })
    const scaleAnimation = animate(scaleSpring, 1, {
        duration: 1,
        delay: 0
      })
    return () => {
      codeAnimation.stop()
      designAnimation.stop()
      positionAnimationDesign.stop()
      positionAnimationCode.stop()
      scaleAnimation.stop()
    }
  }, [])

  // Target values for smooth interpolation
  const targetRotation = useRef(0)
  const targetPositionZ = useRef(0)
  const targetPositionY = useRef(0)
  const targetPositionIcon = useRef(0)
  const lastUpdate = useRef(0)
  
  // Add smoothing factor control
  const { smoothing, updateInterval } = useControls('Scroll Animation', {
    smoothing: { value: 0.5, min: 0.01, max: 1, step: 0.01 },
    updateInterval: { value: 1, min: 0, max: 50, step: 1 } // ms between updates
  })

  // Smooth interpolation function
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  // Throttled scroll handler
  const updateScrollProgress = useCallback(() => {
    const now = performance.now()
    if (now - lastUpdate.current < updateInterval) return
    
    const scrollProgress = window.scrollY / (window.innerHeight * 0.65)
    targetRotation.current = scrollProgress * Math.PI * 0.6
    targetPositionZ.current = scrollProgress * 5
    targetPositionY.current = scrollProgress
    targetPositionIcon.current = scrollProgress
    
    lastUpdate.current = now
  }, [updateInterval])

  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [updateScrollProgress])

  useFrame(() => {
    if (!textRef.current || !batRef.current) return

    // Smooth interpolation
    textRef.current.rotation.x = lerp(
      textRef.current.rotation.x,
      targetRotation.current,
      smoothing
    )
    
    // textRef.current.position.z = lerp(
    //   textRef.current.position.z,
    //   targetPositionZ.current,
    //   smoothing
    // )
    
    textRef.current.position.y = lerp(
      textRef.current.position.y,
      targetPositionY.current,
      smoothing
    )
    if (codeRef.current) {
        if (codeRef.current) {
            codeRef.current.position.y = positionCodeSpring.get()
            //codeRef.current.position.z = positionDesignSpring.get()
          }
    }
    if (designRef.current) {
      designRef.current.position.y = positionDesignSpring.get()
      //designRef.current.position.z = positionCodeSpring.get()
    }

    // Add bat animation
    if (batRef.current) {
      //batRef.current.rotation.y += 0.01 // Simple rotation animation
      batRef.current.position.y = lerp(
        batRef.current.position.y,
        targetPositionIcon.current,
        smoothing
      )
      batRef.current.rotation.x = lerp(
        batRef.current.rotation.x,
        targetRotation.current,
        smoothing
      )
      // You can add more complex animations based on scroll position
      //batRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1 // Floating animation
    }
  })

  return (
    <>
      <group ref={textRef}>
        <group 
          position={[0, -1, 0.5]}
          ref={codeRef}
        >
          <Text3D
            font="/fonts/helvetiker_regular.json"
            size={1.5}
            height={0.02}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0.03}
            bevelSegments={5}
          >
            & Code
            <meshStandardMaterial 
              color={"#fff"} 
              metalness={0.85}
              roughness={0.15}
            />
          </Text3D>
        </group>

        <group 
          position={[0, 0.75, -0.5]} 
          ref={designRef}
        >
          <Text3D
            font="/fonts/helvetiker_regular.json"
            size={1.5}
            height={0.02}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0.03}
            bevelSegments={5}
          >
            Design
            <meshStandardMaterial 
              color={"#fff"} 
              metalness={0.85}
              roughness={0.15}
            />
          </Text3D>
        </group>
      </group>

      <group 
        ref={batRef}
        position={[3, 0, -2]} // Adjust position as needed
        scale={[0.02, 0.02, 0.02]} // Adjust scale as needed
      >
        {/* <mesh
          geometry={nodes.Shape.geometry}
          material={nodes.Shape.material}
        >
          <meshStandardMaterial 
            color={colorMode === 'dark' ? '#132d7c' : '#000000'}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh> */}
      </group>
    </>
  )
}

// Important: Preload the model
useGLTF.preload('/models/bat.gltf')

export default ScrollText
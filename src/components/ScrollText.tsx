import { useColorMode, useBreakpointValue, Show } from '@chakra-ui/react'
import { useFrame } from '@react-three/fiber'
import { Text3D, useGLTF, Center } from '@react-three/drei'
import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { Group, MeshPhysicalMaterial } from 'three'
import { animate, useSpring, useScroll } from 'framer-motion'
import { useControls } from 'leva'
import { motion } from 'framer-motion'
import { Box } from '@chakra-ui/react'


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
    const { colorMode, toggleColorMode } = useColorMode();
    const textRef = useRef<Group>(null)
  const codeRef = useRef<Group>(null)
  const designRef = useRef<Group>(null)
  const batRef = useRef<Group>(null)

  // Load the bat model
  const { nodes } = useGLTF('/models/bat.gltf') as unknown as GLTFResult

  // Create spring animations for each text element
  const codeSpring = useSpring(0, { stiffness: 100, damping: 30 })
  const designSpring = useSpring(0, { stiffness: 100, damping: 30 })
  const positionDesignSpring = useSpring(0, { stiffness: 100, damping: 30 })
  const positionCodeSpring = useSpring(0, { stiffness: 100, damping: 30 })
  const scaleSpring = useSpring(1, { stiffness: 100, damping: 30 })    

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Example logic - adjust based on your actual animation needs
      const designTarget = latest > 0.3 && latest < 0.7 ? 1 : 0; // Fade in/out design
      const codeTarget = latest > 0.6 ? 1 : 0; // Fade in code later
      const scaleTarget = latest > 0.2 && latest < 0.8 ? 1.1 : 1; // Scale up/down
      const designYTarget = latest > 0.4 ? -50 : 0; // Move design up
      const codeYTarget = latest > 0.7 ? 50 : 0; // Move code down

      designSpring.set(designTarget);
      codeSpring.set(codeTarget);
      scaleSpring.set(scaleTarget);
      positionDesignSpring.set(designYTarget);
      positionCodeSpring.set(codeYTarget);
    });

    return () => {
      unsubscribe(); // Cleanup listener
    };
  }, [scrollYProgress, designSpring, codeSpring, scaleSpring, positionDesignSpring, positionCodeSpring]); // Add all dependencies used inside

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
  const positionCode = useBreakpointValue({ base: 0, md: 0 });
  console.log("positionCode", positionCode);
  return (
    <>

    <Center>
      <group ref={textRef} onClick={toggleColorMode}>
        <group 
          position={[0, 0, 0.5]}
          ref={codeRef}
        >
          <Text3D
            font="/fonts/General Sans Extralight Regular.json"
            size={1.5}
            height={0.02}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0.03}
            bevelSegments={5}
            
          >
            & Developer
            <meshStandardMaterial 
              color={"#fff"} 
              metalness={0.85}
              roughness={0.15}
            />
          </Text3D>
        </group>

        <group 
          position={[0, -0.75, -0.5]} 
          ref={designRef}
        >
          <Text3D
            font="/fonts/General Sans Bold.json"
            size={1.5}
            height={0.02}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            
          >
             {useBreakpointValue({ base: 'Motion\nDesigner', lg: 'Motion Designer' })}
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
      </Center>
    </>
  )
}

// Important: Preload the model
useGLTF.preload('/models/bat.gltf')

export default ScrollText
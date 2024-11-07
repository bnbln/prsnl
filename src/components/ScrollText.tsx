import { useColorMode } from '@chakra-ui/react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import { useRef, useEffect, useCallback } from 'react'
import { Group, MeshPhysicalMaterial } from 'three'
import { animate, useSpring } from 'framer-motion'
import { useControls } from 'leva'

const ScrollText: React.FC = () => {
  const { colorMode } = useColorMode()
  const textRef = useRef<Group>(null)
  const codeRef = useRef<Group>(null)
  const designRef = useRef<Group>(null)
  // Create spring animations for each text element
  const codeSpring = useSpring(-1.3, { damping: 20, stiffness: 20, mass: 20, velocity: 0.2 })
  const designSpring = useSpring(-1, { damping: 20, stiffness: 20, mass: 20, velocity: 0.2 })
  const positionSpring = useSpring(4, { damping: 20, stiffness: 20, mass: 100, velocity: 0.2 })
  const positionCodeSpring = useSpring(4, { damping: 20, stiffness: 20, mass: 100, velocity: 0.2 })

  useEffect(() => {
    // Stagger the animations
    const codeAnimation = animate(codeSpring, 0, {
      duration: 1,
      delay: 0.8
    })
    
    const designAnimation = animate(designSpring, 0, {
      duration: 1,
      delay: 0
    })
    const positionAnimation = animate(positionSpring, 0.5, {
      duration: 1,
      delay: 0
    })
    const positionAnimationCode = animate(positionCodeSpring, -0.5, {
        duration: 1,
        delay: 0
      })
    return () => {
      codeAnimation.stop()
      designAnimation.stop()
      positionAnimation.stop()
      positionAnimationCode.stop()
    }
  }, [])

  // Target values for smooth interpolation
  const targetRotation = useRef(0)
  const targetPositionZ = useRef(0)
  const targetPositionY = useRef(0)
  const lastUpdate = useRef(0)
  
  // Add smoothing factor control
  const { smoothing, updateInterval } = useControls('Scroll Animation', {
    smoothing: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    updateInterval: { value: 5, min: 0, max: 50, step: 1 } // ms between updates
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
    targetRotation.current = scrollProgress * Math.PI * 0.65
    targetPositionZ.current = scrollProgress * 6
    targetPositionY.current = scrollProgress
    
    lastUpdate.current = now
  }, [updateInterval])

  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [updateScrollProgress])

  useFrame(() => {
    if (!textRef.current) return

    // Smooth interpolation
    textRef.current.rotation.x = lerp(
      textRef.current.rotation.x,
      targetRotation.current,
      smoothing
    )
    
    textRef.current.position.z = lerp(
      textRef.current.position.z,
      targetPositionZ.current,
      smoothing
    )
    
    textRef.current.position.y = lerp(
      textRef.current.position.y,
      targetPositionY.current,
      smoothing
    )
    if (codeRef.current) {
        if (codeRef.current) {
            codeRef.current.rotation.x = codeSpring.get()
            codeRef.current.position.z = positionSpring.get()
          }
    }
    if (designRef.current) {
      designRef.current.rotation.x = designSpring.get()
      designRef.current.position.z = positionCodeSpring.get()
    }
  })

  return (
    <group ref={textRef}>
      <group 
        position={[0, -1, 0.5]}
        ref={codeRef}
       // scale={[codeSpring.get(), codeSpring.get(), codeSpring.get()]}
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
            color={colorMode === "dark" ? "#fff" : "#000"} 
            metalness={1}
            roughness={0.3}
          />
        </Text3D>
      </group>

      <group position={[0, 0.75, -0.5]} 
        ref={designRef}
      //scale={designSpring.get()}
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
            color={colorMode === "dark" ? "#fff" : "#fff"} 
            metalness={1}
            roughness={0.3}
          />
        </Text3D>
      </group>
    </group>
  )
} 

export default ScrollText;
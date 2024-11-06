import { useColorMode } from '@chakra-ui/react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { Group } from 'three'
import { animate, useSpring } from 'framer-motion'

const ScrollText: React.FC = () => {
  const { colorMode } = useColorMode()
  const textRef = useRef<Group>(null)
  
  // Create spring animations for each text element
  const codeSpring = useSpring(0, { damping: 20 })
  const designSpring = useSpring(0, { damping: 20 })

  useEffect(() => {
    // Stagger the animations
    const codeAnimation = animate(codeSpring, 1, {
      duration: 1,
      delay: 0.2
    })
    
    const designAnimation = animate(designSpring, 1, {
      duration: 1,
      delay: 0.8
    })
    console.log("code animation ", codeAnimation,"designAnimation", designAnimation);

    return () => {
      codeAnimation.stop()
      designAnimation.stop()
    }
  }, [])

  useFrame(() => {
    if (textRef.current) {
      // Get scroll progress (0 to 1)
      const scrollProgress = window.scrollY / (window.innerHeight * 0.65)
      textRef.current.rotation.x = scrollProgress * Math.PI * 0.65
      textRef.current.position.z = scrollProgress * 6
    }
  })

  return (
    <group ref={textRef}>
      <group 
        position={[0, -1, 0.5]}
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
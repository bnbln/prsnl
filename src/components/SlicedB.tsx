import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

export default function SlicedB() {
  const { nodes } = useGLTF('/models/bs.glb') as unknown as { nodes: Record<string, THREE.Mesh> }
  const groupRef = useRef<THREE.Group>(null!)
  const { mouse } = useThree()
  const scroll = useScroll()
  const [isReady, setIsReady] = useState(false)

  // Initialisiere eine leere Mesh-Liste
  const [meshList, setMeshList] = useState<[string, THREE.Mesh][]>([])
  
  // Erstelle eine vorinitialisierte Ref-Liste
  const sliceRefs = useRef<THREE.Mesh[]>([])

  // Verarbeite nodes und erstelle meshList
  useEffect(() => {
    if (!nodes) return
    const validMeshes = Object.entries(nodes).filter(([_, node]) => node?.type === 'Mesh')
    setMeshList(validMeshes as [string, THREE.Mesh][])
    sliceRefs.current = new Array(validMeshes.length).fill(null)
    setIsReady(true)
  }, [nodes])

  useFrame(({ clock }) => {
    if (!isReady || !groupRef.current) return

    const t = clock.getElapsedTime()
    const scrollOffset = scroll.offset
    const mouseX = mouse.x * 0.4
    const mouseY = mouse.y * 0.2

    sliceRefs.current.forEach((ref, i) => {
      if (!ref) return
      
      const offset = i * 0.25
      const wave = Math.sin(t * 2 + offset + scrollOffset * 6) * 0.05
      const wobble = Math.cos(t + i * 0.5) * 0.01

      ref.position.z = wave
      ref.rotation.y = mouseX
      ref.rotation.x = mouseY
      ref.position.x = Math.sin(t * 0.3 + i) * 0.005
      ref.position.y += wobble * 0.001
    })

    groupRef.current.rotation.y = mouseX * 0.4
    groupRef.current.rotation.x = mouseY * 0.2
  })

  if (!isReady) return null

  return (
    <group ref={groupRef}>
      {meshList.map(([name, node], i) => (
        <mesh
          key={name}
          ref={(el) => {
            if (el) sliceRefs.current[i] = el
          }}
          geometry={node.geometry}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
        >
          <meshStandardMaterial
            color="#ff4d00"
            emissive="#ff6a00"
            emissiveIntensity={1.3}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}
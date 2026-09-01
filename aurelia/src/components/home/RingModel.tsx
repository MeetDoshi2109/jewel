'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MeshDistortMaterial, Float, Torus } from '@react-three/drei'
import * as THREE from 'three'

// Stylised ring: a Torus with gem stones scattered around it
function JewelleryRing({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Continuous slow auto-rotation on y-axis
    groupRef.current.rotation.y += delta * 0.4
    // Gentle tilt
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.12
    // Scroll-linked rotation (0–1 maps to 0–2π)
    if (torusRef.current) {
      torusRef.current.rotation.z = scrollProgress * Math.PI * 2
    }
  })

  // Gold material
  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C9A05B'),
    metalness: 0.95,
    roughness: 0.05,
    envMapIntensity: 1.8,
  })

  // Gem material (rose-gold tinted)
  const gemMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B76E79'),
    metalness: 0.3,
    roughness: 0.0,
    envMapIntensity: 3,
    transparent: true,
    opacity: 0.9,
  })

  // Generate gem positions around the ring
  const gemCount = 8
  const gemPositions = Array.from({ length: gemCount }, (_, i) => {
    const angle = (i / gemCount) * Math.PI * 2
    const r = 1.05
    return [Math.cos(angle) * r, Math.sin(angle) * r, 0] as [number, number, number]
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* Band */}
        <Torus ref={torusRef} args={[1, 0.14, 32, 100]} material={goldMat} />

        {/* Inner band detail */}
        <Torus args={[1, 0.04, 16, 100]} material={goldMat}>
          <meshStandardMaterial color="#DDB96A" metalness={0.98} roughness={0.02} />
        </Torus>

        {/* Gems */}
        {gemPositions.map((pos, i) => (
          <mesh key={i} position={pos} rotation={[0, 0, (i / gemCount) * Math.PI * 2]}>
            <octahedronGeometry args={[0.09, 0]} />
            <primitive object={gemMat} />
          </mesh>
        ))}

        {/* Solitaire setting on top */}
        <mesh position={[0, 1.05, 0]}>
          <octahedronGeometry args={[0.18, 1]} />
          <meshStandardMaterial
            color="#E8DDD0"
            metalness={0.1}
            roughness={0.0}
            envMapIntensity={4}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Prongs */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.12, 1.05 + Math.sin(a) * 0.12, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
              <primitive object={goldMat} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-2 border-[#C9A05B]/30 animate-pulse" />
    </div>
  )
}

export default function RingCanvas({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 4, 4]} intensity={1.5} color="#FAF6F0" />
          <directionalLight position={[-3, -2, -3]} intensity={0.5} color="#C9A05B" />
          <pointLight position={[0, 3, 2]} intensity={1} color="#DDB96A" />

          <Suspense fallback={null}>
            <Environment preset="studio" />
            <JewelleryRing scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  )
}

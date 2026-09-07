'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────
// Shared gold material
// ─────────────────────────────────────────────────────────────────
const goldMat = new THREE.MeshPhysicalMaterial({
  color:              new THREE.Color('#C9A05B'),
  metalness:          0.97,
  roughness:          0.04,
  envMapIntensity:    2.4,
  clearcoat:          0.4,
  clearcoatRoughness: 0.08,
  reflectivity:       1,
})

const gemMat = new THREE.MeshPhysicalMaterial({
  color:           new THREE.Color('#E8DDD0'),
  metalness:       0.05,
  roughness:       0.0,
  transmission:    0.92,
  thickness:       0.5,
  envMapIntensity: 3.5,
  transparent:     true,
  opacity:         0.88,
})

const roseGoldMat = new THREE.MeshPhysicalMaterial({
  color:           new THREE.Color('#B76E79'),
  metalness:       0.96,
  roughness:       0.06,
  envMapIntensity: 2.0,
  clearcoat:       0.3,
})

// ─────────────────────────────────────────────────────────────────
// Procedural jewellery piece: ornate pendant + chain links
// ─────────────────────────────────────────────────────────────────
function JewelleryPiece({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef   = useRef<THREE.Group>(null)
  const pendantRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Base auto-rotation
    groupRef.current.rotation.y += delta * 0.38

    // Scroll drives an additional rotation — full turn over one hero viewport
    groupRef.current.rotation.z = scrollProgress * Math.PI * 1.8

    // Gentle breathing tilt
    const t = Date.now() * 0.0005
    groupRef.current.rotation.x = Math.sin(t) * 0.08

    // Pendant slight sway
    if (pendantRef.current) {
      pendantRef.current.rotation.z = Math.sin(t * 0.7) * 0.06
    }
  })

  // Chain links — drape from top to bottom
  const LINK_COUNT = 14
  const LINK_RADIUS = 0.13
  const TUBE_RADIUS = 0.028
  const SPACING     = 0.30

  const links = Array.from({ length: LINK_COUNT }, (_, i) => {
    const t = i / (LINK_COUNT - 1)
    return {
      y:    0.9 - i * SPACING,
      rotY: i % 2 === 0 ? 0 : Math.PI / 2,   // interlocking orientation
      scale: 1 - t * 0.12,                    // links taper slightly downward
    }
  })

  // Pendant geometry: layered circles + centre gem
  const GEM_POSITIONS: [number, number, number][] = [
    [0, 0, 0],           // centre
    [0.22, 0, 0],        // right
    [-0.22, 0, 0],       // left
    [0, 0.22, 0],        // top
    [0, -0.22, 0],       // bottom
    [0.155, 0.155, 0],   // diagonals
    [-0.155, 0.155, 0],
    [0.155, -0.155, 0],
    [-0.155, -0.155, 0],
  ]

  return (
    <group ref={groupRef}>

      {/* ── Chain ── */}
      {links.map((l, i) => (
        <mesh
          key={i}
          position={[0, l.y, 0]}
          rotation={[0, l.rotY, 0]}
          scale={[l.scale, l.scale, l.scale]}
          material={goldMat}
          castShadow
        >
          <torusGeometry args={[LINK_RADIUS, TUBE_RADIUS, 16, 32]} />
        </mesh>
      ))}

      {/* ── Pendant bail (clasp at top of pendant) ── */}
      <mesh position={[0, 0.9 - LINK_COUNT * SPACING + 0.02, 0]} material={goldMat} castShadow>
        <torusGeometry args={[0.09, 0.025, 12, 24]} />
      </mesh>

      {/* ── Pendant body ── */}
      <group
        ref={pendantRef}
        position={[0, 0.9 - LINK_COUNT * SPACING - 0.18, 0]}
      >
        {/* Outer decorative ring */}
        <mesh material={goldMat} castShadow>
          <torusGeometry args={[0.46, 0.035, 20, 64]} />
        </mesh>

        {/* Inner decorative ring */}
        <mesh material={goldMat} castShadow>
          <torusGeometry args={[0.32, 0.022, 16, 48]} />
        </mesh>

        {/* 6 prong arms radiating from centre */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0]}
              rotation={[0, 0, angle]}
              material={goldMat}
              castShadow
            >
              <cylinderGeometry args={[0.014, 0.014, 0.44, 8]} />
            </mesh>
          )
        })}

        {/* Rose-gold accent ring */}
        <mesh material={roseGoldMat} castShadow>
          <torusGeometry args={[0.24, 0.015, 12, 48]} />
        </mesh>

        {/* Gemstone cluster */}
        {GEM_POSITIONS.map(([x, y, z], i) => (
          <mesh
            key={i}
            position={[x, y, z + 0.04]}
            material={i === 0 ? gemMat : goldMat}
            castShadow
          >
            <octahedronGeometry args={[i === 0 ? 0.11 : 0.055, 1]} />
          </mesh>
        ))}

        {/* Centre solitaire prongs */}
        {[0, 1, 2, 3].map(i => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.09, Math.sin(a) * 0.09, 0.05]}
              material={goldMat}
            >
              <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
            </mesh>
          )
        })}

        {/* Decorative edge dots */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0]}
              material={goldMat}
            >
              <sphereGeometry args={[0.022, 8, 8]} />
            </mesh>
          )
        })}
      </group>

    </group>
  )
}

// ─────────────────────────────────────────────────────────────────
// Lighting rig
// ─────────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#FAF6F0" />
      <directionalLight position={[4, 6, 4]}  intensity={1.8} color="#FFF8F0" castShadow
        shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#E8F0FF" />
      <directionalLight position={[0, -3, 2]}  intensity={0.3} color="#DDB96A" />
      <pointLight position={[0, 2, 2]}  intensity={1.2} color="#C9A05B" />
      <pointLight position={[2, -1, 1]} intensity={0.5} color="#B76E79" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// Exported canvas
// ─────────────────────────────────────────────────────────────────
export default function RingCanvas({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias:             true,
          alpha:                 true,
          powerPreference:       'high-performance',
          toneMapping:           THREE.ACESFilmicToneMapping,
          toneMappingExposure:   1.25,
        }}
        shadows
        style={{ background: 'transparent' }}
      >
        <Lighting />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.35}>
            <JewelleryPiece scrollProgress={scrollProgress} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  )
}

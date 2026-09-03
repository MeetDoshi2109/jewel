'use client'

import { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, OrbitControls, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'

// ─────────────────────────────────────────────────────────────────
// Loading progress overlay
// ─────────────────────────────────────────────────────────────────
function LoadingOverlay() {
  const { progress, active } = useProgress()

  if (!active) return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6F0]/80 backdrop-blur-sm rounded-full z-10">
      {/* Circular progress ring */}
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle
          cx="40" cy="40" r="34"
          fill="none" stroke="#E8DDD0" strokeWidth="3"
        />
        <circle
          cx="40" cy="40" r="34"
          fill="none" stroke="#C9A05B" strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 34}`}
          strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <p className="absolute font-serif text-sm text-[#C9A05B] tabular-nums">
        {Math.round(progress)}%
      </p>
      <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#8A8A8E]">
        Loading model
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// The actual Rhino 3DM chain model
// ─────────────────────────────────────────────────────────────────
function ChainModel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const [error, setError] = useState(false)
  const { scene } = useThree()

  // Load the .3dm file using Rhino3dmLoader
  useEffect(() => {
    const loader = new Rhino3dmLoader()
    // Use locally served rhino3dm wasm (no CDN dependency)
    loader.setLibraryPath('/rhino3dm/')

    loader.load(
      '/models/chain.3dm',
      (object: THREE.Object3D) => {
        // Rhino uses Z-up; Three.js uses Y-up — rotate -90° on X
        object.rotation.x = -Math.PI / 2

        // Auto-scale to fit the canvas viewport
        const box = new THREE.Box3().setFromObject(object)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.2 / maxDim
        object.scale.setScalar(scale)

        // Centre the model at origin
        const centre = new THREE.Vector3()
        box.getCenter(centre)
        object.position.sub(centre.multiplyScalar(scale))

        // Apply gold material to every mesh
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.material = new THREE.MeshPhysicalMaterial({
              color:            new THREE.Color('#C9A05B'),
              metalness:        0.96,
              roughness:        0.06,
              envMapIntensity:  2.0,
              reflectivity:     1.0,
              clearcoat:        0.3,
              clearcoatRoughness: 0.1,
            })
            mesh.castShadow    = true
            mesh.receiveShadow = true
          }
        })

        setModel(object)
      },
      (_xhr: ProgressEvent) => {
        // progress handled by useProgress()
      },
      (_err: unknown) => {
        console.warn('3DM load failed, falling back to procedural model')
        setError(true)
      }
    )

    return () => { loader.dispose?.() }
  }, [scene])

  // Animate: auto-rotate + scroll-driven Y rotation
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Gentle auto Y-rotation
    groupRef.current.rotation.y += delta * 0.35

    // Scroll drives an extra full spin (0→1 = 0→360°)
    // We layer this on top of the auto-rotation via a separate offset
    groupRef.current.userData.scrollAngle = scrollProgress * Math.PI * 2

    // Gentle breathing tilt
    groupRef.current.rotation.z = Math.sin(Date.now() * 0.0004) * 0.08
  })

  // Fallback procedural model if .3dm fails to load
  if (error) return <ProceduralChain scrollProgress={scrollProgress} />

  return (
    <group ref={groupRef}>
      {model && <primitive object={model} />}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────
// Procedural chain fallback (renders if .3dm fails)
// ─────────────────────────────────────────────────────────────────
function ProceduralChain({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const goldMat = new THREE.MeshPhysicalMaterial({
    color:           new THREE.Color('#C9A05B'),
    metalness:       0.97,
    roughness:       0.04,
    envMapIntensity: 2.2,
    clearcoat:       0.4,
  })

  // Generate torus links along a curved path
  const linkCount  = 22
  const linkRadius = 0.18   // radius of link ring
  const tubeRadius = 0.038  // thickness of wire
  const spacing    = 0.42   // distance between link centres

  const links = Array.from({ length: linkCount }, (_, i) => {
    const t = i / (linkCount - 1)
    // Slight S-curve drape
    const x = (i - linkCount / 2) * spacing
    const y = -Math.sin(t * Math.PI) * 0.5
    const z = 0
    // Alternate link orientation (90° rotated) for interlocking look
    const rotY = i % 2 === 0 ? 0 : Math.PI / 2
    return { x, y, z, rotY }
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.4
    groupRef.current.rotation.x = -Math.PI / 2 + Math.sin(Date.now() * 0.0005) * 0.06
    // Scroll-driven extra rotation
    groupRef.current.rotation.z = scrollProgress * Math.PI * 2 * 0.3
  })

  return (
    <group ref={groupRef}>
      {links.map((link, i) => (
        <mesh
          key={i}
          position={[link.x, link.y, link.z]}
          rotation={[0, link.rotY, 0]}
          material={goldMat}
          castShadow
        >
          <torusGeometry args={[linkRadius, tubeRadius, 18, 36]} />
        </mesh>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────
// Environment + lighting setup
// ─────────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      {/* Key light — warm */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.8}
        color="#FFF8F0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill — cool rim */}
      <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#E8F0FF" />
      {/* Bottom bounce */}
      <directionalLight position={[0, -3, 2]} intensity={0.3} color="#DDB96A" />
      {/* Ambient */}
      <ambientLight intensity={0.35} color="#FAF6F0" />
      {/* Gold point light to create specular flare */}
      <pointLight position={[0, 2, 2]} intensity={1.2} color="#C9A05B" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// Exported canvas component
// ─────────────────────────────────────────────────────────────────
interface Props {
  scrollProgress?: number
}

export default function RingCanvas({ scrollProgress = 0 }: Props) {
  return (
    <div className="relative w-full h-full" aria-label="3D chain model — turn by scrolling">
      {/* HTML loading overlay rendered outside Canvas */}
      <LoadingOverlay />

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 38 }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        shadows
        style={{ background: 'transparent' }}
      >
        <Lighting />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
            <ChainModel scrollProgress={scrollProgress} />
          </Float>
        </Suspense>

        {/* Orbit controls — disabled auto-rotate so we control it manually */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI * 2 / 3}
          rotateSpeed={0.4}
        />
      </Canvas>
    </div>
  )
}

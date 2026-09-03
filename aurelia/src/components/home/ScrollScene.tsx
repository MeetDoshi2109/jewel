'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Shared scroll progress ref (written by GSAP, read by R3F) ───────
const scrollAngleRef = { current: 0 }

// ─── Scene 2 inner: 3D chain model driven by scroll ──────────────────
function ChainScene() {
  const groupRef  = useRef<THREE.Group>(null)
  const [model, setModel] = useState<THREE.Object3D | null>(null)

  useEffect(() => {
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('/rhino3dm/')
    loader.load('/models/chain.3dm', (obj: THREE.Object3D) => {
      // Rhino Z-up → Three.js Y-up
      obj.rotation.x = -Math.PI / 2

      // Fit to ~2 world units
      const box   = new THREE.Box3().setFromObject(obj)
      const size  = new THREE.Vector3()
      box.getSize(size)
      const s = 2.4 / Math.max(size.x, size.y, size.z)
      obj.scale.setScalar(s)

      // Centre at origin
      const c = new THREE.Vector3()
      box.getCenter(c)
      obj.position.sub(c.multiplyScalar(s))

      // Gold material
      const mat = new THREE.MeshPhysicalMaterial({
        color:              new THREE.Color('#C9A05B'),
        metalness:          0.97,
        roughness:          0.05,
        envMapIntensity:    2.2,
        clearcoat:          0.35,
        clearcoatRoughness: 0.08,
      })
      obj.traverse(c => {
        if ((c as THREE.Mesh).isMesh) {
          (c as THREE.Mesh).material = mat
          c.castShadow = true
        }
      })
      setModel(obj)
    })
    return () => { loader.dispose?.() }
  }, [])

  // Frame loop: read GSAP-driven scroll angle
  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Auto-rotate slowly
    groupRef.current.rotation.y += delta * 0.25
    // Layer in scroll-driven rotation on Z
    groupRef.current.rotation.z = scrollAngleRef.current
    // Gentle breathing
    groupRef.current.rotation.x = -Math.PI / 2 + Math.sin(Date.now() * 0.0004) * 0.05
  })

  return (
    <group ref={groupRef}>
      {model
        ? <primitive object={model} />
        : /* Procedural fallback while model loads */
          <ProceduralLinks />
      }
    </group>
  )
}

function ProceduralLinks() {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#C9A05B'), metalness: 0.97, roughness: 0.05,
    envMapIntensity: 2.2, clearcoat: 0.35,
  })
  const links = Array.from({ length: 18 }, (_, i) => ({
    x: (i - 9) * 0.44,
    y: -Math.sin((i / 17) * Math.PI) * 0.4,
    rotY: i % 2 === 0 ? 0 : Math.PI / 2,
  }))
  return (
    <group>
      {links.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, 0]} rotation={[0, l.rotY, 0]} material={mat} castShadow>
          <torusGeometry args={[0.18, 0.038, 18, 36]} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Scene 2 container ───────────────────────────────────────────────
function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tag1Ref = useRef<HTMLParagraphElement>(null)
  const tag2Ref = useRef<HTMLParagraphElement>(null)
  const tag3Ref = useRef<HTMLParagraphElement>(null)
  const tag4Ref = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

    const obj = { angle: 0, progress: 0 }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=260%',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Write scroll progress → shared ref for R3F to read each frame
            scrollAngleRef.current = self.progress * Math.PI * 2
            // Update progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })

      // Callout tags fade in at milestones
      tl.fromTo(tag1Ref.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25 }, 0.08)
      tl.fromTo(tag2Ref.current, { opacity: 0, x:  40 }, { opacity: 1, x: 0, duration: 0.25 }, 0.3)
      tl.fromTo(tag3Ref.current, { opacity: 0, y:  20 }, { opacity: 1, y: 0, duration: 0.25 }, 0.55)
      tl.fromTo(tag4Ref.current, { opacity: 0, y:  20 }, { opacity: 1, y: 0, duration: 0.25 }, 0.78)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-screen bg-[#FAF6F0] overflow-hidden flex items-center justify-center"
    >
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.025] texture-engrave pointer-events-none" aria-hidden="true" />

      {/* Ambient gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,160,91,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ── 3D Canvas (full viewport, centred) ── */}
      <div className="absolute inset-0 z-10" aria-label="3D chain model — turn the piece by scrolling">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 36 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
          shadows
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.35} color="#FAF6F0" />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#FFF8F0" castShadow />
          <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#E8F0FF" />
          <pointLight position={[0, 2, 2]} intensity={1.1} color="#C9A05B" />
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
              <ChainScene />
            </Float>
          </Suspense>
          <OrbitControls
            enableZoom={false} enablePan={false}
            enableRotate={true}
            minPolarAngle={Math.PI / 3} maxPolarAngle={(2 * Math.PI) / 3}
            rotateSpeed={0.35}
          />
        </Canvas>
      </div>

      {/* ── Header ── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
        <p className="eyebrow text-[#C9A05B] mb-2">The Craft</p>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#1C1C1E] leading-tight">
          Turn the piece.
        </h2>
        <p className="text-xs text-[#8A8A8E] tracking-widest mt-2">↓ Scroll to rotate the chain</p>
      </div>

      {/* ── Floating callout tags ── */}
      <p ref={tag1Ref} className="absolute left-6 md:left-14 top-[38%] opacity-0 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E8DDD0] rounded-full px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-[#C9A05B] shadow-sm">
          ✦ Handcrafted Gold Links
        </span>
      </p>
      <p ref={tag2Ref} className="absolute right-6 md:right-14 top-[48%] opacity-0 z-20 pointer-events-none text-right">
        <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E8DDD0] rounded-full px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-[#C9A05B] shadow-sm">
          Ethically Sourced ✦
        </span>
      </p>
      <p ref={tag3Ref} className="absolute left-6 md:left-14 bottom-[32%] opacity-0 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-2 bg-[#1C1C1E]/85 backdrop-blur-sm rounded-full px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-[#C9A05B]">
          ✦ 15+ Years of Craft
        </span>
      </p>
      <p ref={tag4Ref} className="absolute right-6 md:right-14 bottom-[25%] opacity-0 z-20 pointer-events-none text-right">
        <span className="inline-flex items-center gap-2 bg-[#1C1C1E]/85 backdrop-blur-sm rounded-full px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-[#C9A05B]">
          Jaipur Atelier ✦
        </span>
      </p>

      {/* ── Scroll progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8DDD0] z-20">
        <div ref={progressRef} className="h-full bg-[#C9A05B] w-0 transition-none" />
      </div>

      {/* ── Drag hint icon ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
        <div className="w-5 h-8 rounded-full border-2 border-[#C9A05B]/40 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-[#C9A05B]"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Scene 3: Horizontal collection slide ────────────────────────────
interface CollectionCard {
  category: string
  label: string
  image: string
  count: string
}

const SCENE3_CARDS: CollectionCard[] = [
  { category: 'rings', label: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', count: '18 pieces' },
  { category: 'necklaces', label: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', count: '18 pieces' },
  { category: 'earrings', label: 'Earrings', image: 'https://images.unsplash.com/photo-1630350434070-e9a27b89e4a9?w=600&q=80', count: '18 pieces' },
  { category: 'bangles', label: 'Bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80', count: '15 pieces' },
  { category: 'mens', label: "Men's", image: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&q=80', count: '9 pieces' },
]

function TiltCard({ card, index }: { card: CollectionCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    cardRef.current.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.02)`
  }

  const handleLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-shrink-0 w-64 md:w-72"
    >
      <Link href={`/collections/${card.category}`}>
        <div
          ref={cardRef}
          className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
          style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', transformStyle: 'preserve-3d' }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <Image
            src={card.image}
            alt={card.label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="288px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/70 via-transparent to-transparent" />
          {/* Depth parallax layer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(201,160,91,0.08) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-serif text-xl text-white">{card.label}</p>
            <p className="text-xs text-white/60 tracking-widest mt-1">{card.count}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-white/70 uppercase tracking-widest">Shop</span>
              <ArrowRight size={10} className="text-[#C9A05B] translate-x-0 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Scene3() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // On mobile, skip scroll-jacking
    const isMobile = window.innerWidth < 768
    if (prefersReduced || isMobile || !containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const cards = trackRef.current!.querySelectorAll('.scene3-card')
      const totalWidth = (cards.length - 1) * (288 + 24) // card width + gap

      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerWidth * 0.5}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="overflow-hidden bg-[#F2EBE0] py-20 md:py-0 md:h-screen md:flex md:items-center">
      <div className="px-4 sm:px-8 lg:px-16 w-full">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A05B] mb-3">Collections</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1C1C1E]">Browse by category</h2>
        </div>

        {/* Scrolling track */}
        <div ref={trackRef} className="flex gap-6 md:gap-8 pb-4 overflow-x-auto md:overflow-visible">
          {SCENE3_CARDS.map((card, i) => (
            <div key={card.category} className="scene3-card">
              <TiltCard card={card} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Scene 4: Craftsmanship split-screen ─────────────────────────────
const CRAFT_LINES = [
  'Every Aurelia piece begins',
  'as a sketch in Jaipur —',
  'refined over weeks,',
  'cast by hand,',
  'finished to perfection.',
]

function Scene4() {
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Image scale-reveal on scroll
      gsap.fromTo(imageRef.current,
        { scale: 1.15, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] bg-[#1C1C1E]">
      {/* Image side */}
      <div className="relative overflow-hidden min-h-64 lg:min-h-0">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1573408301828-def33c4cdf7d?w=900&q=80"
            alt="Aurelia artisan at work"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#1C1C1E]/20" />
        </div>
      </div>

      {/* Text side */}
      <div className="flex items-center px-8 md:px-16 py-20">
        <div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A05B] mb-8">Craftsmanship</p>
          <div className="space-y-1">
            {CRAFT_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-serif text-3xl md:text-4xl text-[#FAF6F0] leading-tight"
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C9A05B] border-b border-[#C9A05B]/40 pb-1 hover:border-[#C9A05B] transition-colors"
            >
              Our Story <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Exported composite component ────────────────────────────────────
export default function ScrollScene() {
  return (
    <>
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </>
  )
}

'use client'

import { useEffect, useRef, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Shared scroll progress ref (GSAP writes → R3F reads each frame) ─
const scrollAngleRef = { current: 0 }

// ─────────────────────────────────────────────────────────────────────
// Procedural jewellery model — scroll-driven rotation
// ─────────────────────────────────────────────────────────────────────
const goldMat = new THREE.MeshPhysicalMaterial({
  color:              new THREE.Color('#C9A05B'),
  metalness:          0.97,
  roughness:          0.04,
  envMapIntensity:    2.4,
  clearcoat:          0.4,
  clearcoatRoughness: 0.08,
})

const gemMat = new THREE.MeshPhysicalMaterial({
  color:        new THREE.Color('#E8DDD0'),
  metalness:    0.05,
  roughness:    0.0,
  transmission: 0.92,
  thickness:    0.5,
  envMapIntensity: 3.5,
  transparent:  true,
  opacity:      0.88,
})

const roseGoldMat = new THREE.MeshPhysicalMaterial({
  color:           new THREE.Color('#B76E79'),
  metalness:       0.96,
  roughness:       0.06,
  envMapIntensity: 2.0,
  clearcoat:       0.3,
})

function ScrollPiece() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Gentle auto-rotation
    groupRef.current.rotation.y += delta * 0.3
    // Scroll drives a full Z rotation (so it really feels like "turning the piece")
    groupRef.current.rotation.z = scrollAngleRef.current
    // Soft X breathing
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.07
  })

  // Chain links
  const LINKS = Array.from({ length: 16 }, (_, i) => ({
    y:    0.95 - i * 0.27,
    rotY: i % 2 === 0 ? 0 : Math.PI / 2,
    s:    1 - i * 0.01,
  }))

  // Pendant gem positions
  const GEM_POS: [number, number, number][] = [
    [0,     0,    0],
    [0.22,  0,    0], [-0.22, 0,    0],
    [0,     0.22, 0], [0,    -0.22, 0],
    [0.155, 0.155, 0], [-0.155, 0.155, 0],
    [0.155,-0.155, 0], [-0.155,-0.155, 0],
  ]

  const pendantY = 0.95 - 16 * 0.27 - 0.22

  return (
    <group ref={groupRef}>
      {/* Chain */}
      {LINKS.map((l, i) => (
        <mesh key={i} position={[0, l.y, 0]} rotation={[0, l.rotY, 0]}
          scale={[l.s, l.s, l.s]} material={goldMat} castShadow>
          <torusGeometry args={[0.13, 0.028, 16, 32]} />
        </mesh>
      ))}

      {/* Bail */}
      <mesh position={[0, pendantY + 0.18, 0]} material={goldMat} castShadow>
        <torusGeometry args={[0.09, 0.025, 12, 24]} />
      </mesh>

      {/* Pendant */}
      <group position={[0, pendantY, 0]}>
        <mesh material={goldMat} castShadow><torusGeometry args={[0.46, 0.035, 20, 64]} /></mesh>
        <mesh material={goldMat} castShadow><torusGeometry args={[0.32, 0.022, 16, 48]} /></mesh>
        <mesh material={roseGoldMat} castShadow><torusGeometry args={[0.24, 0.015, 12, 48]} /></mesh>

        {/* Spokes */}
        {[0,1,2,3,4,5].map(i => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a)*0.22, Math.sin(a)*0.22, 0]}
              rotation={[0, 0, a]} material={goldMat} castShadow>
              <cylinderGeometry args={[0.014, 0.014, 0.44, 8]} />
            </mesh>
          )
        })}

        {/* Gem cluster */}
        {GEM_POS.map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z + 0.04]}
            material={i === 0 ? gemMat : goldMat} castShadow>
            <octahedronGeometry args={[i === 0 ? 0.11 : 0.055, 1]} />
          </mesh>
        ))}

        {/* Edge beads */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a)*0.46, Math.sin(a)*0.46, 0]}
              material={goldMat}>
              <sphereGeometry args={[0.022, 8, 8]} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Scene 2 — "Turn the piece" — GSAP scroll → R3F rotation
// ─────────────────────────────────────────────────────────────────────
function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tag1Ref      = useRef<HTMLParagraphElement>(null)
  const tag2Ref      = useRef<HTMLParagraphElement>(null)
  const tag3Ref      = useRef<HTMLParagraphElement>(null)
  const tag4Ref      = useRef<HTMLParagraphElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

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
            // Write to shared ref — R3F reads it every frame
            scrollAngleRef.current = self.progress * Math.PI * 2
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })

      // Callout tags materialise at scroll milestones
      tl.fromTo(tag1Ref.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25 }, 0.08)
      tl.fromTo(tag2Ref.current, { opacity: 0, x:  40 }, { opacity: 1, x: 0, duration: 0.25 }, 0.30)
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
      {/* Fine texture */}
      <div className="absolute inset-0 opacity-[0.025] texture-engrave pointer-events-none" aria-hidden="true" />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(201,160,91,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ── 3D canvas — full viewport ── */}
      <div className="absolute inset-0 z-10" aria-label="Procedural jewellery pendant — scroll to turn it">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 38 }}
          dpr={[1, 2]}
          gl={{
            antialias:           true,
            alpha:               true,
            toneMapping:         THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          shadows
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.35} color="#FAF6F0" />
          <directionalLight position={[4, 6, 4]}  intensity={1.8} color="#FFF8F0" castShadow />
          <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#E8F0FF" />
          <pointLight position={[0, 2, 2]} intensity={1.2} color="#C9A05B" />
          <pointLight position={[2,-1, 1]} intensity={0.4} color="#B76E79" />

          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.18}>
              <ScrollPiece />
            </Float>
          </Suspense>
        </Canvas>
      </div>

      {/* ── Header ── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
        <p className="eyebrow text-[#C9A05B] mb-2">The Craft</p>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#1C1C1E] leading-tight">
          Turn the piece.
        </h2>
        <p className="text-xs text-[#8A8A8E] tracking-widest mt-2">↓ Scroll to rotate</p>
      </div>

      {/* ── Floating callout tags ── */}
      <p ref={tag1Ref} className="absolute left-6 md:left-14 top-[38%] opacity-0 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm border border-[#E8DDD0] rounded-full px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-[#C9A05B] shadow-sm">
          ✦ Handcrafted in 18k Gold
        </span>
      </p>
      <p ref={tag2Ref} className="absolute right-6 md:right-14 top-[48%] opacity-0 z-20 pointer-events-none text-right">
        <span className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm border border-[#E8DDD0] rounded-full px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-[#C9A05B] shadow-sm">
          Conflict-Free Stones ✦
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

      {/* ── Gold progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8DDD0] z-20">
        <div ref={progressRef} className="h-full bg-[#C9A05B] w-0" style={{ transition: 'none' }} />
      </div>

      {/* ── Scroll cue ── */}
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

// ─────────────────────────────────────────────────────────────────────
// Scene 3 — Horizontal category scroll-jack
// ─────────────────────────────────────────────────────────────────────
interface CollectionCard {
  category: string
  label: string
  image: string
  count: string
}

const SCENE3_CARDS: CollectionCard[] = [
  { category: 'rings',     label: 'Rings',      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=85', count: '18 pieces' },
  { category: 'necklaces', label: 'Necklaces',  image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=85', count: '18 pieces' },
  { category: 'earrings',  label: 'Earrings',   image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=85', count: '18 pieces' },
  { category: 'bangles',   label: 'Bangles',    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&q=85', count: '15 pieces' },
  { category: 'mens',      label: "Men's",      image: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=700&q=85', count: '9 pieces'  },
]

function TiltCard({ card, index }: { card: CollectionCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2
    ref.current.style.transform = `perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.02)`
  }
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-shrink-0 w-64 md:w-72"
    >
      <Link href={`/collections/${card.category}`} data-cursor="Shop">
        <div
          ref={ref}
          className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
          style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', transformStyle: 'preserve-3d' }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <Image
            src={card.image}
            alt={card.label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="288px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/75 via-transparent to-transparent" />

          {/* Gold shimmer on hover */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
            style={{ background: 'linear-gradient(90deg, #C9A05B, transparent)' }} />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-serif text-xl text-white leading-tight">{card.label}</p>
            <p className="text-xs text-white/55 tracking-widest mt-1">{card.count}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-white/65 uppercase tracking-widest">Shop</span>
              <ArrowRight size={10} className="text-[#C9A05B] group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Scene3() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (prefersReduced || isMobile || !containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const cards = trackRef.current!.querySelectorAll('.scene3-card')
      const totalWidth = (cards.length - 1) * (288 + 32)

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
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="rule-gold" />
            <span className="eyebrow">Collections</span>
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] text-[#1C1C1E] leading-[0.92] tracking-[-0.025em]">
            Browse by category
          </h2>
        </div>
        <div ref={trackRef} className="flex gap-8 pb-4 overflow-x-auto md:overflow-visible">
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

// ─────────────────────────────────────────────────────────────────────
// Scene 4 — Craftsmanship split-screen reveal
// ─────────────────────────────────────────────────────────────────────
const CRAFT_LINES = [
  'Every Aurelia piece begins',
  'as a sketch in Jaipur —',
  'refined over weeks,',
  'cast by hand,',
  'finished to perfection.',
]

function Scene4() {
  const imageRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { scale: 1.14, opacity: 0 },
        {
          scale: 1, opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end:   'top 20%',
            scrub: 1,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] bg-[#1C1C1E]">
      {/* Image */}
      <div className="relative overflow-hidden min-h-64 lg:min-h-0">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80"
            alt="Aurelia artisan setting a gemstone by hand"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#1C1C1E]/20" />
        </div>
      </div>

      {/* Text */}
      <div className="flex items-center px-8 md:px-16 py-20">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="rule-gold" />
            <span className="eyebrow">Craftsmanship</span>
          </div>
          <div className="space-y-1">
            {CRAFT_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] text-[#FAF6F0] leading-tight"
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
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#C9A05B] border-b border-[#C9A05B]/40 pb-1 hover:border-[#C9A05B] transition-colors"
            >
              Our Story
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Composite export
// ─────────────────────────────────────────────────────────────────────
export default function ScrollScene() {
  return (
    <>
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </>
  )
}

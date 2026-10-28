import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Cpu, Terminal, ArrowRight, Zap, Lock, Sparkles, Orbit } from 'lucide-react'

interface Props {
  onEnter: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  baseAlpha: number
}

const BOOT_LOGS = [
  'Allocating NIST FIPS 203 ML-KEM-768 lattice memory bounds...',
  'Connecting to Zenith-Mesh Substrate PoA Ledger node...',
  'Calibrating Wasm SFI isolated sandbox environment...',
  'Probing Z3 SMT formal logical invariant provers: SAT...',
  'Synchronizing Groq neural inference substrate...',
  'AEGIS-PRIME Sovereign Intelligence Mesh: READY.'
]

export default function AegisIntroSplash({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
  const [bootStep, setBootStep] = useState(0)
  const [bootProgress, setBootProgress] = useState(0)
  const [isHoveringBtn, setIsHoveringBtn] = useState(false)

  // Particle Canvas Setup & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null }
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Palette: Cyber Cyan, Emerald Quantum, Violet Core, Gold Invariant
    const colors = ['#06b6d4', '#10b981', '#8b5cf6', '#38bdf8', '#00f5ff']
    const count = Math.min(Math.floor((width * height) / 9500), 120)
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const baseAlpha = Math.random() * 0.6 + 0.25
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw interactive connections
      const maxDist = 135
      const mouseMaxDist = 180

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        // Update positions
        p1.x += p1.vx
        p1.y += p1.vy

        // Bounce from walls
        if (p1.x < 0 || p1.x > width) p1.vx *= -1
        if (p1.y < 0 || p1.y > height) p1.vy *= -1

        // Mouse attraction/repulsion interaction
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = mouseRef.current.x - p1.x
          const dy = mouseRef.current.y - p1.y
          const dist = Math.hypot(dx, dy)
          if (dist < mouseMaxDist) {
            // Laser connection to cursor
            const mouseAlpha = (1 - dist / mouseMaxDist) * 0.7
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
            ctx.strokeStyle = `rgba(6, 182, 212, ${mouseAlpha})`
            ctx.lineWidth = 0.9
            ctx.stroke()

            // Subtle particle gentle drift toward cursor
            p1.x += (dx / dist) * 0.35
            p1.y += (dy / dist) * 0.35
          }
        }

        // Inter-particle links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.hypot(dx, dy)

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.28
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }

        // Draw particle node with neon glow
        ctx.save()
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2)
        ctx.fillStyle = p1.color
        ctx.globalAlpha = p1.alpha
        ctx.shadowBlur = 12
        ctx.shadowColor = p1.color
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Auto-progress boot terminal sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        const next = prev + 2
        setBootStep(Math.min(Math.floor((next / 100) * BOOT_LOGS.length), BOOT_LOGS.length - 1))
        return next
      })
    }, 45)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col justify-between">
      {/* 1. Deep Cyber Grid Background Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* 2. Interactive HTML5 Quantum Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 h-full w-full pointer-events-auto"
      />

      {/* 3. Concentric Cyber Radar Rings (Rotating SVG) */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[780px] h-[780px] opacity-25">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-16 rounded-full border border-cyan-500/25 border-t-cyan-400"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-32 rounded-full border border-dotted border-emerald-400/30"
        />
      </div>

      {/* 4. Top Telemetry Bar */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
            AEGIS-PRIME // PROTOCOL v2.4
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            POST-QUANTUM MESH
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NIST ML-KEM-768</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>SUBSTRATE PoA</span>
          </div>
          <button
            onClick={onEnter}
            className="px-3 py-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-slate-200 transition text-xs font-mono"
          >
            Skip Intro ➔
          </button>
        </div>
      </header>

      {/* 5. Center Hero Showcase */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-4xl mx-auto">
        {/* Holographic Logo Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-30 blur-xl animate-pulse" />
          <div className="relative p-4 rounded-2xl bg-slate-900/80 border border-cyan-400/40 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 text-cyan-400">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </motion.div>

        {/* Title: AEGIS PRIME with Cyber Shimmer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono text-xs tracking-wider uppercase mb-2 shadow-xs shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Sovereign Intelligence Architecture</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.18em] sm:tracking-[0.24em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            AEGIS PRIME
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
            Autonomous Enterprise Guarded Invariant Sovereign Microkernel & Lattice Cryptographic Mesh
          </p>
        </motion.div>

        {/* Live Terminal Diagnostic Readout Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-xl mt-8 rounded-2xl bg-slate-950/80 border border-white/10 p-4 font-mono text-xs text-left shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                Boot Diagnostics // Stage 0
              </span>
            </div>
            <span className="text-cyan-400 font-bold">{bootProgress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300"
              style={{ width: `${bootProgress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Log readout */}
          <div className="space-y-1.5 text-[11px] h-14 flex flex-col justify-end overflow-hidden">
            <div className="text-slate-500 truncate">
              {bootStep > 0 ? `> ${BOOT_LOGS[bootStep - 1]}` : '> Initializing quantum seed entropy...'}
            </div>
            <div className="text-cyan-300 font-medium truncate flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>&gt; {BOOT_LOGS[bootStep]}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Button: ENTER CONSOLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onEnter}
            onMouseEnter={() => setIsHoveringBtn(true)}
            onMouseLeave={() => setIsHoveringBtn(false)}
            className="group relative px-8 py-4 rounded-2xl font-mono text-sm font-bold tracking-widest uppercase transition-all duration-300 overflow-hidden shadow-2xl shadow-cyan-500/30 flex items-center gap-3 cursor-pointer"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Inner Glow Border */}
            <div className="absolute inset-[1px] rounded-2xl bg-slate-950/30 backdrop-blur-xs transition-colors group-hover:bg-transparent" />

            {/* Content */}
            <span className="relative z-10 text-slate-950 font-black flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              INITIALIZE SOVEREIGN TERMINAL
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-slate-950 stroke-[3] transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </motion.div>
      </main>

      {/* 6. Footer Badges */}
      <footer className="relative z-20 w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 backdrop-blur-md bg-slate-950/40 text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            L1 LUMINA-AUTH: ACTIVE
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            L2 SYNAPSE-OS: ACTIVE
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            L3 CYPHER-SHIELD: PQC
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            L4 ZENITH-MESH: MPT
          </span>
        </div>

        <div className="text-slate-500">
          Protected by IEEE Sec. 5 & 6 Sovereign Formal Invariants
        </div>
      </footer>
    </div>
  )
}

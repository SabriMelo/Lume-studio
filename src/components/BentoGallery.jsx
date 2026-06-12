import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { BENTO_PROJECTS } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_URL = '/videos/sala.mp4'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

// ── CARD ──────────────────────────────────────────────────────
function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      data-card
      className="group relative w-full h-full rounded-2xl overflow-hidden block bg-stone-900"
      // will-change definido inline para garantir promoção a layer antes do scroll
      style={{ opacity: 0, transform: 'scale(0.88)', willChange: 'opacity, transform' }}
    >
      <img
        src={project.img}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="font-sans text-[0.55rem] tracking-[0.18em] uppercase text-white/55">
          {project.category}
        </p>
        <p className="font-serif text-white text-lg leading-tight tracking-tight mt-0.5">
          {project.title}
        </p>
      </div>
    </Link>
  )
}

// ── BENTO GALLERY ─────────────────────────────────────────────
export default function BentoGallery() {
  const [isMobile] = useState(() => window.innerWidth < 768)

  const sectionRef     = useRef(null)
  const stickyRef      = useRef(null)
  const videoWrapRef   = useRef(null)
  const bentoGridRef   = useRef(null)
  const placeholderRef = useRef(null)
  const btnRef         = useRef(null)
  const ctxRef         = useRef(null)

  useEffect(() => {
    if (isMobile) return

    ctxRef.current = gsap.context(() => {
      // Valores cacheados — medidos uma vez, evitam getBoundingClientRect no hot path
      let cachedDx = 0, cachedDy = 0
      let cachedW0 = 0, cachedH0 = 0   // viewport size
      let cachedSX = 1, cachedSY = 1   // target scale (placeholder / viewport)
      let cards = [], ready = false

      const cacheRects = () => {
        const rect       = placeholderRef.current?.getBoundingClientRect()
        const stickyRect = stickyRef.current?.getBoundingClientRect()
        if (!rect || !stickyRect) return

        // Offset do centro do viewport ao centro do placeholder
        cachedDx = (rect.left + rect.width  / 2) - (stickyRect.left + stickyRect.width  / 2)
        cachedDy = (rect.top  + rect.height / 2) - (stickyRect.top  + stickyRect.height / 2)

        cachedW0 = window.innerWidth
        cachedH0 = window.innerHeight

        // Scale target: razão placeholder / viewport
        cachedSX = rect.width  / cachedW0
        cachedSY = rect.height / cachedH0

        cards = Array.from(stickyRef.current.querySelectorAll('[data-card]'))
        ready = true
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: stickyRef.current,
        anticipatePin: 1,
        scrub: 0.8,            // ↓ reduzido de 1 para resposta mais rápida
        onRefresh: () => { ready = false },

        onUpdate(self) {
          if (!ready) cacheRects()

          const p  = self.progress
          const vw = videoWrapRef.current

          // ── 1. Vídeo: translate + scale (sem layout reflow) ──────
          // Substituição de width/height/margin → tudo no compositor GPU
          const e     = easeInOutQuad(Math.min(p / 0.40, 1))
          const curSX = 1 - (1 - cachedSX) * e
          const curSY = 1 - (1 - cachedSY) * e
          const dx    = cachedDx * e
          const dy    = cachedDy * e

          // border-radius em local-space: radius_aparente / scale
          // queremos radius aparente = 14*e px
          const cssRadius = e > 0 ? (14 * e) / Math.min(curSX, curSY) : 0

          vw.style.transform    = `translate(${dx}px,${dy}px) scale(${curSX},${curSY})`
          vw.style.borderRadius = `${cssRadius}px`

          // ── 2. Grade (opacity — compositor) ──────────────────────
          bentoGridRef.current.style.opacity =
            String(Math.max(0, Math.min((p - 0.25) / 0.35, 1)))

          // ── 3. Cards (opacity + scale — compositor) ───────────────
          for (let i = 0; i < cards.length; i++) {
            const ec = easeInOutQuad(Math.max(0, Math.min((p - 0.35 - i * 0.04) / 0.25, 1)))
            cards[i].style.opacity   = String(ec)
            cards[i].style.transform = `scale(${0.88 + ec * 0.12})`
          }

          // ── 4. Botão (opacity + transform — compositor) ───────────
          const bp = Math.max(0, Math.min((p - 0.80) / 0.15, 1))
          btnRef.current.style.opacity   = String(bp)
          btnRef.current.style.transform = `translateY(${(1 - bp) * 12}px)`
        },
      })
    }, sectionRef)

    return () => { ctxRef.current?.revert(); ctxRef.current = null }
  }, [isMobile])

  useLayoutEffect(() => {
    return () => { ctxRef.current?.revert(); ctxRef.current = null }
  }, [])

  const [s1, s2, s3, s4, s5, s6, s7, s8] = BENTO_PROJECTS
  const cells = [s1, s2, s3, s4, null, s5, s6, s7, s8]

  // ── MOBILE ───────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section className="relative z-10 bg-[#f0ede6] px-4 py-16">
        <div className="grid grid-cols-2 gap-3">
          {BENTO_PROJECTS.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group relative rounded-2xl overflow-hidden block bg-stone-900 aspect-3/4"
            >
              <img
                src={project.img}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-sans text-[0.5rem] tracking-[0.16em] uppercase text-white/55">
                  {project.category}
                </p>
                <p className="font-serif text-white text-sm leading-tight tracking-tight mt-0.5">
                  {project.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 font-sans text-[0.68rem] tracking-[0.18em] uppercase text-stone-600 hover:text-stone-900 border border-stone-300 hover:border-stone-900 rounded-full px-10 py-4 transition-all duration-300"
          >
            Ver todos os projetos
            <span className="text-[0.65rem]">↗</span>
          </Link>
        </div>
      </section>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className="relative z-10 bg-[#f0ede6]" style={{ height: '500vh' }}>

      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#f0ede6]"
      >

        {/* Grade 3×3 */}
        <div
          ref={bentoGridRef}
          className="absolute inset-0 grid gap-2.5 p-2.5 opacity-0"
          style={{
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            willChange: 'opacity',
          }}
        >
          {cells.map((project, idx) =>
            project === null ? (
              <div
                key="video-placeholder"
                ref={placeholderRef}
                className="rounded-2xl bg-transparent"
              />
            ) : (
              <ProjectCard key={project.id} project={project} />
            )
          )}
        </div>

        {/* Vídeo — começa fullscreen, anima para a célula central via transform */}
        {/* top:0 left:0 width:100vw height:100vh → sem translate(-50%) no layout */}
        {/* A animação usa translate+scale no compositor, zero layout reflow        */}
        <div
          ref={videoWrapRef}
          className="absolute z-10 overflow-hidden"
          style={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            // will-change correto: só props que o compositor consegue isolar
            willChange: 'transform, border-radius',
          }}
        >
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
          />

          {/* Botão */}
          <div
            ref={btnRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0, willChange: 'opacity, transform' }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-6 font-sans tracking-[0.18em] uppercase text-white hover:text-stone-900 border-2 border-white/70 hover:border-[#f0ede6] hover:bg-[#f0ede6] rounded-full px-28 py-8 transition-all duration-300 backdrop-blur-md bg-white/15 shadow-xl"
              style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)' }}
            >
              View all projects
              <span className="text-[0.65rem]">↗</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

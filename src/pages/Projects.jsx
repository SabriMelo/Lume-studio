import { useRef, useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { PROJECTS, VIDEOS, FILTERS } from '../data/projects'

const VideoModal = lazy(() => import('../components/VideoModal'))

// ── CARD DE IMAGEM ────────────────────────────────────────────
function Card({ project }) {
  const imgRef = useRef(null)

  const onEnter = () => gsap.to(imgRef.current, { scale: 1.06, duration: 0.6, ease: 'power2.out' })
  const onLeave = () => gsap.to(imgRef.current, { scale: 1,    duration: 0.6, ease: 'power2.out' })

  return (
    <Link
      to={`/projects/${project.id}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-xl block bg-stone-200"
      style={{ aspectRatio: '3/4' }}
    >
      <img
        ref={imgRef}
        src={project.img}
        alt={project.title}
        decoding="async"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transformOrigin: 'center' }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-500" />
      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
        <p className="font-sans text-[0.5rem] tracking-[0.2em] uppercase text-white/55 mb-1">
          {project.category} — {project.year}
        </p>
        <p className="font-serif text-white text-xl leading-tight tracking-tight">
          {project.title}
        </p>
      </div>
    </Link>
  )
}

// ── CARD DE VÍDEO ─────────────────────────────────────────────
function VideoCard({ video, onPlay }) {
  const imgRef  = useRef(null)
  const iconRef = useRef(null)

  const onEnter = () => {
    gsap.to(imgRef.current,  { scale: 1.06, duration: 0.6, ease: 'power2.out' })
    gsap.to(iconRef.current, { scale: 1.15, duration: 0.35, ease: 'power2.out' })
  }
  const onLeave = () => {
    gsap.to(imgRef.current,  { scale: 1,   duration: 0.6, ease: 'power2.out' })
    gsap.to(iconRef.current, { scale: 1,   duration: 0.35, ease: 'power2.out' })
  }

  return (
    <button
      onClick={() => onPlay(video)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-xl block bg-stone-900 w-full text-left cursor-pointer"
      style={{ aspectRatio: '3/4' }}
      aria-label={`Reproduzir vídeo: ${video.title}`}
    >
      {/* Thumbnail */}
      <img
        ref={imgRef}
        src={video.img}
        alt={video.title}
        decoding="async"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        style={{ transformOrigin: 'center' }}
        onContextMenu={e => e.preventDefault()}
        draggable={false}
      />

      {/* Gradiente escuro */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/80 transition-colors duration-500" />

      {/* Ícone de play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={iconRef}
          className="w-14 h-14 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:border-white/70 group-hover:bg-white/20 transition-colors duration-300"
        >
          {/* Triângulo de play */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="ml-1">
            <path d="M4 2.5l11 6.5L4 15.5V2.5z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Badge "Vídeo" */}
      <div className="absolute top-3 right-3">
        <span className="font-sans text-[0.45rem] tracking-[0.2em] uppercase text-white/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
          Vídeo
        </span>
      </div>

      {/* Metadados no rodapé */}
      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
        <p className="font-sans text-[0.5rem] tracking-[0.2em] uppercase text-white/55 mb-1">
          Vídeo — {video.year}
        </p>
        <p className="font-serif text-white text-xl leading-tight tracking-tight">
          {video.title}
        </p>
      </div>
    </button>
  )
}

// ── PÁGINA ───────────────────────────────────────────────────
export default function Projects() {
  const [active,     setActive]     = useState('all')
  const [activeVideo, setActiveVideo] = useState(null) // vídeo aberto no modal
  const gridRef    = useRef(null)
  const filterRefs = useRef([])
  const titleRef   = useRef(null)

  // Itens filtrados: projetos de imagem + vídeos
  const filtered = active === 'all'
    ? [...PROJECTS, ...VIDEOS]
    : active === 'videos'
      ? VIDEOS
      : PROJECTS.filter(p => p.category === active)

  // Animação de entrada da página
  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0, y: 28 })
    gsap.set(filterRefs.current, { opacity: 0, y: 16 })
    gsap.to(titleRef.current,
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )
    gsap.to(filterRefs.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07, delay: 0.3 }
    )
  }, [])

  // Animação dos cards ao trocar filtro
  useLayoutEffect(() => {
    const cards = gridRef.current?.querySelectorAll('[data-card]')
    if (!cards?.length) return
    gsap.fromTo(cards,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06 }
    )
  }, [active])

  const handleFilter = (key) => {
    if (key === active) return
    const cards = gridRef.current?.querySelectorAll('[data-card]')
    gsap.to(cards, {
      opacity: 0, y: -12, scale: 0.97,
      duration: 0.2, ease: 'power2.in',
      onComplete: () => setActive(key),
    })
  }

  return (
    <div className="min-h-screen bg-[#f0ede6] px-6 md:px-20 pt-28 md:pt-36 pb-24">
      <div className="max-w-350 mx-auto">

        {/* Título */}
        <h1
          ref={titleRef}
          className="font-serif italic font-normal text-stone-900 mb-12 tracking-tight"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
        >
          Projects
        </h1>

        {/* Filtros */}
        <div className="flex items-center gap-0 mb-14 border-b border-stone-300 overflow-x-auto scrollbar-none">
          {FILTERS.map(({ key, label }, i) => (
            <button
              key={key}
              ref={el => { filterRefs.current[i] = el }}
              onClick={() => handleFilter(key)}
              className="relative group shrink-0 px-4 md:px-6 py-4 font-sans text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-300 outline-none"
              style={{ color: active === key ? '#1c1917' : '#a8a29e' }}
            >
              {label}
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-stone-900 origin-left transition-transform duration-400"
                style={{ transform: active === key ? 'scaleX(1)' : 'scaleX(0)' }}
              />
              {active !== key && (
                <span className="absolute inset-x-0 bottom-0 h-px bg-stone-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
              )}
            </button>
          ))}
        </div>

        {/* Grade */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map(item => (
            <div key={item.id} data-card>
              {item.type === 'video'
                ? <VideoCard video={item} onPlay={setActiveVideo} />
                : <Card project={item} />
              }
            </div>
          ))}
        </div>

        {/* Contador */}
        <p className="mt-10 font-sans text-[0.58rem] tracking-[0.16em] uppercase text-stone-400">
          {filtered.length} projeto{filtered.length !== 1 ? 's' : ''}
        </p>

      </div>

      {/* Modal de vídeo — lazy, só carrega quando aberto */}
      {activeVideo && (
        <Suspense fallback={null}>
          <VideoModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        </Suspense>
      )}
    </div>
  )
}

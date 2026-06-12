import { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const project    = PROJECTS.find(p => p.id === Number(id))

  const wrapperRef  = useRef(null)  // seção que será pinada
  const trackRef    = useRef(null)  // faixa horizontal que desliza
  const introRef    = useRef(null)  // elementos de entrada

  // Próximo projeto (circular)
  const nextProject = PROJECTS[(PROJECTS.findIndex(p => p.id === project?.id) + 1) % PROJECTS.length]

  useEffect(() => {
    if (!project || window.innerWidth < 768) return

    const ctx = gsap.context(() => {

      // Entrada da página
      gsap.fromTo(
        introRef.current?.querySelectorAll('[data-intro]'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.1 }
      )

      // Scroll horizontal
      const track   = trackRef.current
      const wrapper = wrapperRef.current
      const panels  = track.querySelectorAll('[data-panel]')

      const totalScroll = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Cada painel entra com fade
      panels.forEach((panel, i) => {
        if (i === 0) return
        gsap.fromTo(
          panel.querySelectorAll('[data-fade]'),
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: ScrollTrigger.getById('hscroll'),
              start: 'left 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

    }, wrapperRef)

    return () => ctx.revert()
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f0ede6] flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-stone-400 mb-4">Projeto não encontrado</p>
          <Link to="/projects" className="font-serif text-stone-900 underline underline-offset-4">
            Ver todos os projetos
          </Link>
        </div>
      </div>
    )
  }

  const idFormatted = String(project.id).padStart(2, '0')

  return (
    <div className="bg-[#f0ede6]">

      {/* ── MOBILE LAYOUT ──────────────────────────────────── */}
      <div className="md:hidden min-h-screen pt-24 pb-16 px-6">

        {/* Back */}
        <Link to="/projects" className="inline-flex items-center gap-2 font-sans text-[0.6rem] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors mb-10">
          ← Todos os projetos
        </Link>

        {/* Header info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-sans text-[0.5rem] tracking-[0.22em] uppercase text-stone-400 mb-0.5">Categoria</p>
            <p className="font-sans text-[0.72rem] tracking-[0.06em] text-stone-700 font-medium">
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-sans text-[0.5rem] tracking-[0.22em] uppercase text-stone-400 mb-0.5">Ano</p>
            <p className="font-sans text-[0.72rem] tracking-[0.06em] text-stone-700 font-medium">{project.year}</p>
          </div>
        </div>

        {/* Cover image */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
          <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {/* Title + architect */}
        <div className="mb-10">
          {project.architect && project.architect !== '---' && (
            <div className="flex items-baseline gap-1.5 mb-2">
              <p className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-stone-400">Arquiteto</p>
              <a href={project.architectInstagram} target="_blank" rel="noopener noreferrer"
                className="font-sans text-[0.82rem] text-stone-500 hover:text-stone-900 transition-colors">
                {project.architect}
              </a>
            </div>
          )}
          <h1 className="font-serif italic font-normal text-stone-900 leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 8vw, 3.5rem)' }}>
            {project.title}
          </h1>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 gap-3">
          {project.images.map((imgUrl, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <img src={imgUrl} alt={`${project.title} — ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Next project */}
        <div
          className="mt-8 relative rounded-2xl overflow-hidden cursor-pointer group"
          style={{ aspectRatio: '16/9' }}
          onClick={() => navigate(`/projects/${nextProject.id}`)}
        >
          <img src={nextProject.img} alt={nextProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="font-sans text-[0.5rem] tracking-[0.26em] uppercase text-white/40 mb-3">Próximo projeto</p>
            <h2 className="font-serif font-normal text-white leading-tight tracking-tight" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)' }}>
              {nextProject.title}
            </h2>
          </div>
        </div>

      </div>

      {/* ── SEÇÃO HORIZONTAL (pinada) — desktop only ───────── */}
      <section ref={wrapperRef} className="hidden md:block relative h-screen overflow-hidden">

        {/* Faixa que desliza */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex will-change-transform"
          style={{ width: 'max-content' }}
        >

          {/* ── PAINEL 0 — CAPA SPLIT ───────────────────────── */}
          <div
            data-panel
            ref={introRef}
            className="flex h-screen shrink-0"
            style={{ width: '100vw' }}
          >

            {/* ── ESQUERDA — info (bege) ── */}
            <div className="relative flex flex-col justify-between w-1/2 h-full bg-[#f0ede6] px-12 shrink-0"
              style={{ paddingTop: 'clamp(5rem, 9vh, 7rem)', paddingBottom: 'clamp(2rem, 4vh, 3rem)' }}
            >

              {/* Topo: categoria + ano */}
              <div
                data-intro
                className="flex items-start justify-between"
                style={{ opacity: 0 }}
              >
                <div>
                  <p className="font-sans text-[0.5rem] tracking-[0.22em] uppercase text-stone-400 mb-0.5">
                    Categoria
                  </p>
                  <p className="font-sans text-[0.72rem] tracking-[0.06em] text-stone-700 font-medium">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-[0.5rem] tracking-[0.22em] uppercase text-stone-400 mb-0.5">
                    Ano
                  </p>
                  <p className="font-sans text-[0.72rem] tracking-[0.06em] text-stone-700 font-medium">
                    {project.year}
                  </p>
                </div>
              </div>

              {/* Centro: thumbnail */}
              <div
                data-intro
                className="flex justify-center"
                style={{ opacity: 0 }}
              >
                <div
                  className="rounded-2xl overflow-hidden shadow-md"
                  style={{ width: 'clamp(140px, 18vw, 220px)', height: 'clamp(140px, 18vw, 220px)' }}
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Rodapé: arquiteto + título */}
              <div data-intro style={{ opacity: 0 }}>
                {project.architect && (
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <p className="font-sans text-[.8rem] tracking-[0.22em] uppercase text-stone-400">
                      Arquiteto
                    </p>
                    <a
                      href={project.architectInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[.9rem] text-stone-500 hover:text-stone-900 transition-colors duration-200"
                    >
                      {project.architect}
                    </a>
                  </div>
                )}
                <h1
                  className="font-serif italic font-normal text-stone-900 leading-[0.9] tracking-tight"
                  style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
                >
                  {project.title}
                </h1>

                {/* scroll hint */}
                <div className="flex items-center gap-3 mt-8">
                  <div className="w-6 h-px bg-stone-300" />
                  <span className="font-sans text-[0.5rem] tracking-[0.22em] uppercase text-stone-400">
                    scroll para explorar
                  </span>
                </div>
              </div>

            </div>

            {/* ── DIREITA — imagem full bleed ── */}
            <div
              data-intro
              className="relative w-1/2 h-full shrink-0 overflow-hidden"
              style={{ opacity: 0 }}
            >
              <img
                src={project.img}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

          </div>

          {/* ── PAINÉIS DE GALERIA (uma imagem por painel) ─── */}
          {project.images.map((imgUrl, i) => (
            <div
              key={i}
              data-panel
              className="relative h-screen shrink-0 overflow-hidden"
              style={{ width: i === 1 ? '58vw' : '72vw', marginLeft: '6px' }}
            >
              <img
                src={imgUrl}
                alt={`${project.title} — ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Número da imagem */}
              <div className="absolute bottom-8 right-8">
                <span className="font-sans text-[0.5rem] tracking-[0.24em] uppercase text-white/30">
                  {String(i + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}

          {/* ── PAINEL FINAL — PRÓXIMO PROJETO ──────────────── */}
          <div
            data-panel
            className="relative h-screen shrink-0 overflow-hidden group cursor-pointer"
            style={{ width: '100vw', marginLeft: '6px' }}
            onClick={() => navigate(`/projects/${nextProject.id}`)}
          >
            <img
              src={nextProject.img}
              alt={nextProject.title}
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
              <p className="font-sans text-[0.55rem] tracking-[0.28em] uppercase text-white/40 mb-4">
                Próximo projeto
              </p>
              <h2 className="font-serif font-normal text-white leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                {nextProject.title}
              </h2>
              <p className="font-sans text-[0.58rem] tracking-[0.18em] uppercase text-white/40 mt-3">
                {nextProject.category} — {nextProject.year}
              </p>
              <div className="mt-8 w-8 h-px bg-white/30" />
            </div>
          </div>

        </div>{/* /trackRef */}

        {/* ── ID DO PROJETO (fixo no canto) ─────────────────── */}
        <div className="fixed top-1/2 right-8 -translate-y-1/2 z-40 pointer-events-none">
          <span
            className="font-sans text-[0.5rem] tracking-[0.3em] uppercase text-stone-400"
            style={{ writingMode: 'vertical-rl' }}
          >
            {idFormatted}
          </span>
        </div>

      </section>{/* /wrapperRef */}

    </div>
  )
}

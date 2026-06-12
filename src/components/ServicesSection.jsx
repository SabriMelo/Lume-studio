import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    id: 1,
    name: 'Imagens Residenciais',
    description: 'Renders de alta fidelidade que apresentam projetos residenciais com realismo e atmosfera antes mesmo da construção.',
    img: '/projects/casa-rf-romero-duarte/CASA_DIA_FR_RD_3.webp',
  },
  {
    id: 2,
    name: 'Imagens Interiores',
    description: 'Visualizações de interiores que capturam luz, textura e proporção com precisão fotográfica.',
    img: '/projects/rr-studiob2/st-1.webp',
  },
  {
    id: 3,
    name: 'Imagens Comerciais',
    description: 'Representações de espaços comerciais e corporativos que comunicam identidade e funcionalidade.',
    img: '/projects/esc-j-studiob2/escrit-1.webp',
  },
  {
    id: 4,
    name: 'Imagens para Empreendimentos',
    description: 'Visualizações de imagens para empreendimentos que capturam luz, textura e proporção com precisão fotográfica.',
    img: '/projects/villa-teresa-romeroduarte/01.webp',
  },
  {
    id: 5,
    name: 'Modelagem 3D para Arquitetura',
    description: 'Modelagem tridimensional detalhada para arquitetura, produto e cenografia com geometria precisa.',
    img: '/projects/modelagem-3d.webp',
  },
]

export default function ServicesSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const rowRefs    = useRef([])
  const contactRef = useRef(null)
  const imgRefs    = useRef([])
  const arrowRefs  = useRef([])
  const descRef    = useRef(null)
  const prevRef    = useRef(null)

  const [desc, setDesc]               = useState('')
  const [mobileActiveIdx, setMobileActiveIdx] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Título
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      // Linhas de serviço — stagger
      gsap.fromTo(rowRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.10,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      )

      // Linha "Entre em Contato"
      gsap.fromTo(contactRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          delay: SERVICES.length * 0.10,
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleEnter = useCallback((i) => {
    const prev = prevRef.current

    // Garante que qualquer imagem fora da transição atual fique oculta
    imgRefs.current.forEach((img, idx) => {
      if (idx !== i && idx !== prev) {
        gsap.killTweensOf(img)
        gsap.set(img, { opacity: 0, scale: 1 })
      }
    })

    if (prev !== null && prev !== i) {
      gsap.to(imgRefs.current[prev], { opacity: 0, duration: 0.25, ease: 'power2.inOut', overwrite: true })
    }

    gsap.fromTo(
      imgRefs.current[i],
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true }
    )

    setDesc(SERVICES[i].description)
    gsap.fromTo(descRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: true })
    gsap.to(arrowRefs.current[i], { x: 7, duration: 0.20, ease: 'power2.out', overwrite: true })

    prevRef.current = i
  }, [])

  const handleLeave = useCallback((i) => {
    gsap.to(imgRefs.current[i],   { opacity: 0, duration: 0.25, ease: 'power2.inOut', overwrite: true })
    gsap.to(descRef.current,      { opacity: 0, duration: 0.20, ease: 'power2.in',    overwrite: true })
    gsap.to(arrowRefs.current[i], { x: 0,       duration: 0.20, ease: 'power2.out',   overwrite: true })
    prevRef.current = null
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#f0ede6] px-10 md:px-20 py-28">
      <div className="max-w-350 mx-auto">

        {/* Título */}
        <h2
          ref={titleRef}
          className="font-serif italic font-normal text-stone-900 mb-20 tracking-tight"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', opacity: 0 }}
        >
          Serviços
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] md:gap-20 items-start">

          {/* ── LISTA ── */}
          <div>
            {SERVICES.map((s, i) => (
              <div
                key={s.id}
                ref={el => { rowRefs.current[i] = el }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
                onClick={() => setMobileActiveIdx(i)}
                className="group relative flex items-center justify-center py-9 cursor-pointer border-t border-stone-300"
                style={{ opacity: 0 }}
              >
                {/* Linha de hover na parte de baixo */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-stone-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />

                {/* Número — absoluto à esquerda */}
                <span className="absolute left-0 font-sans text-[0.62rem] tracking-[0.16em] text-stone-400 transition-colors duration-300 group-hover:text-stone-600">
                  ({s.id})
                </span>

                {/* Nome — centro absoluto da linha */}
                <span
                  className="font-sans tracking-[0.08em] md:tracking-[0.18em] uppercase text-stone-700 transition-colors duration-300 group-hover:text-stone-900 text-center px-8 md:px-0"
                  style={{ fontSize: 'clamp(0.72rem, 1.1vw, 1.05rem)' }}
                >
                  {s.name}
                </span>

                {/* Seta — absoluta à direita */}
                <span
                  ref={el => { arrowRefs.current[i] = el }}
                  className="absolute right-0 font-sans text-stone-400 transition-colors duration-300 group-hover:text-stone-900"
                >
                  →
                </span>
              </div>
            ))}

            {/* ── Entre em Contato — sem numeração ── */}
            {/* ── Entre em Contato — sem numeração ── 
            <a
              ref={contactRef}
              href="/contato"
              className="group relative flex items-center justify-center py-9 border-t border-b border-stone-300"
              style={{ opacity: 0 }}
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-stone-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />

              <span
                className="font-serif italic font-normal text-stone-400 group-hover:text-stone-900 transition-colors duration-300"
                style={{ fontSize: 'clamp(1rem, 1.4vw, 1.3rem)' }}
              >
                Entre em Contato
              </span>

              <span className="absolute right-0 font-sans text-stone-300 group-hover:text-stone-900 transition-all duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </a> */}
          </div> 

          {/* ── PAINEL DIREITO (sticky) ── */}
          <div className="hidden md:block sticky top-32">

            {/* Imagem */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              {SERVICES.map((s, i) => (
                <img
                  key={s.id}
                  ref={el => { imgRefs.current[i] = el }}
                  src={s.img}
                  alt={s.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0 }}
                />
              ))}
            </div>

            {/* Descrição — elemento único */}
            <p
              ref={descRef}
              className="mt-5 font-serif italic text-stone-500 leading-snug"
              style={{ fontSize: 'clamp(0.82rem, 1vw, 0.96rem)', opacity: 0, minHeight: '3.5rem' }}
            >
              {desc}
            </p>

          </div>
        </div>
      </div>

      {/* ── MOBILE: overlay flutuante ── */}
      {mobileActiveIdx !== null && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-6"
          onClick={() => setMobileActiveIdx(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ aspectRatio: '3/4' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={SERVICES[mobileActiveIdx].img}
              alt={SERVICES[mobileActiveIdx].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/50 mb-1">
                Serviço {mobileActiveIdx + 1}
              </p>
              <p className="font-serif text-white text-lg leading-tight tracking-tight mb-2">
                {SERVICES[mobileActiveIdx].name}
              </p>
              <p className="font-sans text-[0.72rem] text-white/70 leading-relaxed">
                {SERVICES[mobileActiveIdx].description}
              </p>
            </div>
            <button
              onClick={() => setMobileActiveIdx(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/70 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </section>
  )
}

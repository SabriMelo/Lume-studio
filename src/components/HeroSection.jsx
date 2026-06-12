import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useArcCarousel } from '../hooks/useArcCarousel'

export default function HeroSection() {
  const eyebrowRef = useRef(null)
  const titleRef   = useRef(null)
  const stageRef   = useRef(null)
  const taglineRef = useRef(null)

  const { buildCards, destroy } = useArcCarousel(stageRef)

  useEffect(() => {
    gsap.set(eyebrowRef.current, { opacity: 0, y: 6  })
    gsap.set(titleRef.current,   { opacity: 0, y: 40 })
    gsap.set(taglineRef.current, { opacity: 0 })

    const tl = gsap.timeline()
    tl
      // Início antecipado: 0.2s (era 0.5s), duração menor: 0.7s (era 0.8s)
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out'   }, 0.2)
      // Título: começa em 0.3s (era 0.6s), duração 0.9s (era 1.1s)
      .to(titleRef.current,   { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }, 0.3)
      // Cards: chamado em 0.5s (era 1.1s) — a entrada começa logo após o título
      .add(() => buildCards(tl), 0.5)
      // Tagline: aparece em 1.8s (era 2.3s)
      .to(taglineRef.current, { opacity: 1, duration: 0.9, ease: 'expo.out' }, 1.8)

    return () => tl.kill()
  }, [buildCards])

  useLayoutEffect(() => {
    return () => destroy()
  }, [destroy])

  return (
    <section className="sticky top-0 z-0 h-screen flex flex-col items-center justify-start overflow-hidden bg-[#f0ede6]" style={{ paddingTop: '15vh' }}>

      {/* Título */}
      <div className="relative z-20 flex flex-col items-center text-center gap-0.5">
        <p
          ref={eyebrowRef}
          className="font-sans text-[0.62rem] tracking-[0.26em] uppercase text-[#2f2116]/70"
        >
          Studio
        </p>
        <span
          ref={titleRef}
          className="font-serif font-normal leading-[0.9] tracking-[-0.03em] text-stone-900"
          style={{ fontSize: 'clamp(5.5rem, 16vw, 13rem)' }}
        >
          LUME
        </span>
      </div>

      {/* Arc stage — ponto de origem das cartas */}
      <div
        ref={stageRef}
        className="absolute top-[58%] md:top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 w-px h-px pointer-events-none"
      />

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 z-20 font-sans tracking-[0.2em] uppercase text-[#2f2116] text-center leading-loose px-6 w-full"
        style={{ fontSize: 'clamp(0.48rem, 0.9vw, 0.62rem)' }}
      >
        Visualization Studio — Dedicated to Bringing Architectural Concepts to Life
      </p>

    </section>
  )
}

import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WorksPanel() {
  const sectionRef = useRef(null)
  const innerRef   = useRef(null)
  const lineRef    = useRef(null)

  const ctxRef = useRef(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => {

      gsap.set(innerRef.current, { yPercent: 30, opacity: 0 })
      gsap.set(lineRef.current,  { scaleX: 0, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // entra
      tl.to(innerRef.current,
        { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      )
      tl.to(lineRef.current,
        { scaleX: 1, opacity: 1, duration: 0.20, ease: 'expo.out' },
        '<0.05'
      )

      // pausa
      tl.to({}, { duration: 0.20 })

      // sai
      tl.to(innerRef.current,
        { yPercent: -20, opacity: 0, duration: 0.45, ease: 'power2.inOut' }
      )
      tl.to(lineRef.current,
        { scaleX: 0, opacity: 0, duration: 0.25, ease: 'power1.in' },
        '<'
      )

    }, sectionRef)
    return () => { ctxRef.current?.revert(); ctxRef.current = null }
  }, [])

  useLayoutEffect(() => {
    return () => { ctxRef.current?.revert(); ctxRef.current = null }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative z-10 h-screen w-full flex items-center justify-center bg-[#f0ede6] overflow-hidden"
    >
      <div ref={innerRef} className="flex flex-col items-center gap-3 select-none">
        <span className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-stone-400">
          Selected
        </span>

        <h2
          className="font-serif font-normal text-stone-900 leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(7rem, 22vw, 18rem)' }}
        >
          Projetos
        </h2>

        <div
          ref={lineRef}
          className="h-px bg-stone-300 origin-center"
          style={{ width: 'clamp(120px, 20vw, 280px)' }}
        />
      </div>
    </section>
  )
}

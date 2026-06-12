import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LETTERS = ['L', 'U', 'M', 'E']

export default function LoadingScreen({ onComplete }) {
  const panelRef   = useRef(null)
  const lettersRef = useRef([])
  const studioRef  = useRef(null)
  const lineRef    = useRef(null)

  useEffect(() => {
    const letters = lettersRef.current
    const panel   = panelRef.current

    gsap.set(letters,        { yPercent: 110 })
    gsap.set(studioRef.current, { opacity: 0, y: 6 })
    gsap.set(lineRef.current,   { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({ onComplete })

    // Letras sobem uma por uma (clip reveal) — ritmo mais cadenciado
    tl.to(letters, {
      yPercent: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
    }, 0.4)

    // Linha e "Studio" aparecem após as letras
    tl.to(lineRef.current,   { scaleX: 1, duration: 0.8, ease: 'expo.out' }, '-=0.25')
    tl.to(studioRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '<0.1')

    // Pausa — tempo para respirar
    tl.to({}, { duration: 0.9 })

    // Cortina sobe como um pano de palco: começa devagar, ganha velocidade
    tl.to(panel, {
      yPercent: -100,
      duration: 1.1,
      ease: 'power3.inOut',
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f0ede6] overflow-hidden"
    >
      {/* Letras com clip reveal */}
      <div className="flex gap-[0.04em] overflow-hidden" style={{ paddingBottom: '0.08em' }}>
        {LETTERS.map((letter, i) => (
          <span
            key={letter}
            ref={el => { lettersRef.current[i] = el }}
            className="font-serif font-normal leading-none tracking-[-0.03em] text-stone-900 block"
            style={{ fontSize: 'clamp(5.5rem, 18vw, 14rem)' }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Linha + Studio */}
      <div className="flex items-center gap-4 mt-3 w-full px-[max(2rem,10vw)]">
        <div
          ref={lineRef}
          className="flex-1 h-px bg-stone-900/30"
        />
        <p
          ref={studioRef}
          className="font-sans text-[0.58rem] tracking-[0.28em] uppercase text-stone-900/60 shrink-0"
        >
          Studio
        </p>
      </div>
    </div>
  )
}

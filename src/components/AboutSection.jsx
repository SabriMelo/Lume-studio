import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WORDS_P1 = [
  'Me', 'chamo', 'Sabrina,', 'sou', 'designer', 'e', 'atuo', 'há', '7', 'anos',
  'na', 'área', 'de', 'modelagem', 'e', 'visualização', '3D.', 'Ao', 'longo',
  'desse', 'tempo,', 'desenvolvi', 'uma', 'ampla', 'gama', 'de', 'habilidades',
  'que', 'me', 'permitem', 'criar', 'perspectivas', 'externas', 'para', 'projetos',
  'residenciais', 'e', 'comerciais,', 'além', 'de', 'imagens', 'de', 'interiores',
  'com', 'alto', 'nível', 'de', 'detalhamento.', 'Minha', 'experiência', 'abrange',
  'desde', 'a', 'criação', 'de', 'modelos', 'técnicos', 'precisos', 'até', 'a',
  'renderização', 'final,', 'sempre', 'com', 'o', 'objetivo', 'de', 'assegurar',
  'a', 'fidelidade', 'ao', 'projeto', 'original.',
]

const WORDS_P2 = [
  'Minha', 'abordagem', 'de', 'trabalho', 'é', 'guiada', 'por', 'um',
  'compromisso', 'constante', 'com', 'a', 'qualidade', 'estética', 'e', 'o',
  'realismo.', 'Acredito', 'que', 'cada', 'projeto', 'tem', 'uma', 'história',
  'única', 'a', 'contar,', 'e', 'meu', 'papel', 'é', 'valorizar', 'o', 'conceito',
  'arquitetônico', 'por', 'meio', 'de', 'representações', 'visuais', 'impactantes.',
  'Ao', 'longo', 'dos', 'anos,', 'colaborei', 'com', 'arquitetos', 'e', 'designers',
  'de', 'renome,', 'contribuindo', 'para', 'apresentações', 'que', 'fortalecem',
  'a', 'comunicação', 'com', 'clientes,', 'atraem', 'investidores', 'e',
  'enriquecem', 'materiais', 'de', 'lançamento.',
]

// Array combinado — usado para calcular os índices da animação
const WORDS = [...WORDS_P1, ...WORDS_P2]

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function AboutSection() {
  const [isMobile] = useState(() => window.innerWidth < 768)

  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const img1Ref    = useRef(null)
  const labelRef   = useRef(null)
  const wordsRef   = useRef([])

  const ctxRef = useRef(null)

  useEffect(() => {
    if (isMobile) return
    ctxRef.current = gsap.context(() => {

      // estados iniciais
      gsap.set([img1Ref.current, labelRef.current], {
        opacity: 0, y: 36,
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=600%',
        pin: stickyRef.current,
        anticipatePin: 1,
        scrub: 1.2,

        onUpdate(self) {
          const p = self.progress

          // ── Label "About" ──────────────────── 0–6%
          const lP = easeOut(Math.min(p / 0.06, 1))
          labelRef.current.style.opacity   = lP
          labelRef.current.style.transform = `translateY(${(1 - lP) * 36}px)`

          // ── Imagem ──────────────────────── 3–20%
          const i1 = easeOut(Math.max(0, Math.min((p - 0.03) / 0.17, 1)))
          img1Ref.current.style.opacity   = i1
          img1Ref.current.style.transform = `translateY(${(1 - i1) * 48}px)`

          // ── Palavras: revelam de 8% até 96% ─────────
          const N = wordsRef.current.length
          wordsRef.current.forEach((word, i) => {
            if (!word) return
            const start = 0.08 + (i / N) * 0.76
            const wP    = easeOut(Math.max(0, Math.min((p - start) / 0.12, 1)))
            word.style.opacity = 0.12 + wP * 0.88
          })
        },
      })

    }, sectionRef)
    return () => { ctxRef.current?.revert(); ctxRef.current = null }
  }, [])

  useLayoutEffect(() => {
    return () => { ctxRef.current?.revert(); ctxRef.current = null }
  }, [])

  if (isMobile) {
    return (
      <section id="about" className="relative z-10 bg-[#f0ede6] px-6 py-16">
        <p className="font-serif text-[2.2rem] tracking-[0.22em] uppercase text-stone-400 mb-6">
          Sobre
        </p>
        <div className="rounded-2xl overflow-hidden mb-8" style={{ height: 'clamp(260px, 55vw, 420px)' }}>
          <img src="/about.webp" alt="Sabrina — Lume Studio" loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-6 text-justify">
          {[WORDS_P1, WORDS_P2].map((para, i) => (
            <p
              key={i}
              className="font-serif font-normal leading-[1.6] tracking-[-0.01em] text-stone-700"
              style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
            >
              {para.join(' ')}
            </p>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 bg-[#f0ede6]"
      style={{ height: '700vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex items-center px-10 md:px-20"
      >
        <div className="grid grid-cols-[1fr_1.1fr] gap-14 w-full max-w-350 mx-auto items-center">

          {/* ── ESQUERDA: imagem + label ──────────────── */}
          <div className="flex flex-col gap-4">

            {/* Label */}
            <div ref={labelRef} style={{ opacity: 0 }}>
              <p className="font-serif text-[4rem] tracking-[0.28em] uppercase text-stone-400 mb-3">
                Sobre
              </p>
            </div>

            {/* Imagem única */}
            <div
              ref={img1Ref}
              className="relative rounded-2xl overflow-hidden"
              style={{ opacity: 0, height: 'clamp(360px, 55vh, 620px)' }}
            >
              <img
                src="/about.webp"
                alt="Sabrina — Lume Studio"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          {/* ── DIREITA: texto mascarado ────────────── */}
          <div className="flex flex-col justify-center gap-6 text-justify">
            {[WORDS_P1, WORDS_P2].map((para, pIdx) => {
              const offset = pIdx === 0 ? 0 : WORDS_P1.length
              return (
                <p
                  key={pIdx}
                  className="font-serif font-normal leading-[1.18] tracking-[-0.02em] text-stone-900"
                  style={{ fontSize: 'clamp(1rem, 1.7vw, 1.3rem)' }}
                >
                  {para.map((word, i) => (
                    <span
                      key={i}
                      ref={el => { wordsRef.current[offset + i] = el }}
                      className="inline-block mr-[0.26em]"
                      style={{ opacity: 0.12 }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}

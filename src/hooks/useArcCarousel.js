import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { HERO_IMAGES } from '../data/heroData'

// Pré-carrega imagens assim que o módulo é importado —
// antes de qualquer animação começar
if (typeof window !== 'undefined') {
  HERO_IMAGES.forEach(src => { (new Image()).src = src })
}

// ── CONSTANTES ──────────────────────────────────────────────
const AUTO_SPEED   = 0.0018
const LOOP_TIMEOUT = 7000
const ARC_ROT_MAX  = 20
const SCALE_CENTER = 1.12
const SCALE_SIDE   = 0.76
const CARD_W        = 'clamp(216px, 23vw, 342px)'
const CARD_H        = 'clamp(420px, 58vh, 700px)'
const CARD_W_MOBILE = 'clamp(185px, 52vw, 260px)'
const CARD_H_MOBILE = 'clamp(290px, 66vh, 430px)'

// ── HELPERS ─────────────────────────────────────────────────
function spreadX() {
  return window.innerWidth < 768
    ? Math.min(window.innerWidth * 0.42, 220)
    : Math.min(window.innerWidth * 0.46, 560)
}
function yDrop() { return window.innerHeight * 0.09 }

function getArcPos(t) {
  return {
    x:     t * spreadX(),
    y:     (t * t) * yDrop(),
    rot:   t * ARC_ROT_MAX,
    scale: SCALE_SIDE + (1 - Math.abs(t)) * (SCALE_CENTER - SCALE_SIDE),
    z:     Math.round((1 - Math.abs(t)) * 10) + 1,
  }
}

// ── HOOK ────────────────────────────────────────────────────
export function useArcCarousel(stageRef) {
  const state = useRef({
    cards:     [],
    overlays:  [],   // cacheados para evitar querySelector a cada frame
    arcOffset: 0,
    velocity:  0,
    rafId:     null,
    phase:     'idle',
    cycleTimer: null,
  })

  // gsap.set com todas as props de uma vez = 1 update de matrix CSS por card.
  // Separar em múltiplos setters/calls geraria 4x mais updates — pior performance.
  const layoutCards = useCallback((offset) => {
    const { cards, overlays } = state.current
    const N = cards.length
    if (!N) return

    cards.forEach((card, i) => {
      let pos = i - offset
      pos = pos - Math.round(pos / N) * N
      const t = Math.max(-1, Math.min(1, pos / ((N - 1) / 2)))
      const visible = Math.abs(pos) <= (N - 1) / 2 + 0.5

      card.style.visibility = visible ? 'visible' : 'hidden'

      const { x, y, rot, scale, z } = getArcPos(t)
      gsap.set(card, { x, y, rotation: rot, scale, zIndex: z })

      if (overlays[i]) {
        overlays[i].style.background = Math.abs(t) > 0.55 ? 'rgba(0,0,0,0.26)' : 'rgba(0,0,0,0)'
      }
    })
  }, [])

  // ── FASES DO CICLO ───────────────────────────────────────

  const startLoop = useCallback(() => {
    const s = state.current
    s.phase = 'loop'
    if (s.rafId) cancelAnimationFrame(s.rafId)

    const tick = () => {
      if (s.phase !== 'loop') return
      s.velocity  *= 0.92
      s.arcOffset += AUTO_SPEED + s.velocity
      layoutCards(s.arcOffset)
      s.rafId = requestAnimationFrame(tick)
    }
    tick()

    clearTimeout(s.cycleTimer)
    s.cycleTimer = setTimeout(() => {
      if (s.phase === 'loop') playCycle()
    }, LOOP_TIMEOUT)
  }, [layoutCards])

  const doOpenArc = useCallback(() => {
    const { cards } = state.current
    const N = cards.length
    const tl = gsap.timeline({ onComplete: startLoop })
    cards.forEach((card, i) => {
      const t = (i / (N - 1)) * 2 - 1
      const { x, y, rot, scale, z } = getArcPos(t)
      tl.to(card, { x, y, rotation: rot, scale, zIndex: z, duration: 0.7, ease: 'expo.inOut' }, i * 0.04)
    })
  }, [startLoop])

  const doReset = useCallback(() => {
    const s = state.current
    s.phase = 'reset'

    s.cards.forEach(card => {
      gsap.set(card, { y: -window.innerHeight * 0.5, x: 0, opacity: 0, rotation: 0, scale: 0.9, zIndex: 5 })
    })
    s.arcOffset = (s.cards.length - 1) / 2

    const tl = gsap.timeline({ onComplete: doOpenArc })
    s.cards.forEach((card, i) => {
      tl.to(card, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, i * 0.06)
    })
  }, [doOpenArc])

  const doFall = useCallback(() => {
    const s = state.current
    s.phase = 'fall'
    const fallDist = window.innerHeight * 0.95

    const tl = gsap.timeline({ onComplete: doReset })
    s.cards.forEach((card, i) => {
      tl.to(card, { y: fallDist, opacity: 0, duration: 0.7, ease: 'power3.in' }, i * 0.07)
    })
  }, [doReset])

  const doSpread = useCallback(() => {
    const s = state.current
    s.phase = 'spread'
    const N    = s.cards.length
    const cardW = s.cards[0].offsetWidth
    const gap   = Math.min((window.innerWidth * 0.82) / (N - 1), cardW * 1.1)
    const startX = -((N - 1) / 2) * gap

    const tl = gsap.timeline({ onComplete: doFall })
    s.cards.forEach((card, i) => {
      tl.to(card, {
        x: startX + i * gap, y: 0, rotation: 0, scale: 0.85, zIndex: i + 1,
        duration: 1.0, ease: 'expo.out',
      }, i * 0.07)
    })
  }, [doFall])

  const playCycle = useCallback(() => {
    const s = state.current
    s.phase = 'gather'
    if (s.rafId) cancelAnimationFrame(s.rafId)
    const N = s.cards.length

    const tl = gsap.timeline({ onComplete: doSpread })
    s.cards.forEach((card, i) => {
      tl.to(card, {
        x: 0, y: 0, rotation: 0, scale: 0.9, zIndex: N - i,
        duration: 1.1, ease: 'expo.inOut',
      }, i * 0.05)
    })
  }, [doSpread])

  // ── BUILD ────────────────────────────────────────────────
  const buildCards = useCallback((introTl) => {
    if (!stageRef.current) return
    const s = state.current
    const mobile = window.innerWidth < 768
    const images = mobile ? HERO_IMAGES.slice(0, 4) : HERO_IMAGES
    const cardW   = mobile ? CARD_W_MOBILE : CARD_W
    const cardH   = mobile ? CARD_H_MOBILE : CARD_H
    const N = images.length

    if (s.rafId) cancelAnimationFrame(s.rafId)
    s.cards.forEach(c => { if (c.isConnected) c.remove() })
    s.cards    = []
    s.overlays = []

    images.forEach((src) => {
      const card = document.createElement('div')
      card.style.cssText = `
        position: absolute;
        width: ${cardW};
        height: ${cardH};
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 28px 72px rgba(0,0,0,0.20);
        transform-origin: center bottom;
        top: 0; left: 0;
        margin-left: calc(${cardW} / -2);
        margin-top: calc(${cardH} / -2);
        will-change: transform, opacity;
        pointer-events: none;
      `

      const img = document.createElement('img')
      img.src = src
      img.alt = ''
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;'

      const overlay = document.createElement('div')
      overlay.setAttribute('data-overlay', '')
      overlay.style.cssText = 'position:absolute;inset:0;transition:background 0.5s;'

      card.appendChild(img)
      card.appendChild(overlay)
      stageRef.current.appendChild(card)

      s.cards.push(card)
      s.overlays.push(overlay)
    })

    s.arcOffset = (N - 1) / 2
    s.cards.forEach(card => {
      gsap.set(card, { x: 0, y: -window.innerHeight * 0.5, rotation: 0, scale: 0.9, opacity: 0, zIndex: 5 })
    })

    // Entrada em cascata: 0.4s por card com overlap >-0.35 (antes: 0.65s / >-0.55)
    s.cards.forEach((card) => {
      introTl.to(card, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }, `>-0.35`)
    })

    introTl.add(doOpenArc, '>')
  }, [stageRef, doOpenArc])

  const destroy = useCallback(() => {
    const s = state.current
    if (s.rafId) cancelAnimationFrame(s.rafId)
    clearTimeout(s.cycleTimer)
    s.cards.forEach(c => { if (c.isConnected) c.remove() })
    s.cards    = []
    s.overlays = []
    s.phase    = 'idle'
  }, [])

  return { buildCards, destroy }
}

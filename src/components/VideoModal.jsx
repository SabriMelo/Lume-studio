import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * VideoModal — lightbox de vídeo com proteção contra download
 *
 * Proteções aplicadas:
 *  • controlsList="nodownload"          → remove botão de download dos controles nativos
 *  • disablePictureInPicture            → impede picture-in-picture
 *  • onContextMenu preventDefault       → bloqueia menu de contexto (botão direito)
 *  • CSS pointer-events: none + overlay → impede arrastar/selecionar o vídeo
 *  • Tecla S (save) bloqueada no modal  → impede Ctrl+S
 */
export default function VideoModal({ video, onClose }) {
  const overlayRef   = useRef(null)
  const containerRef = useRef(null)
  const videoRef     = useRef(null)

  // ── Entrada / saída com GSAP ─────────────────────────────
  useEffect(() => {
    const overlay   = overlayRef.current
    const container = containerRef.current

    gsap.set(overlay,   { opacity: 0 })
    gsap.set(container, { opacity: 0, scale: 0.93, y: 16 })

    const tl = gsap.timeline()
    tl.to(overlay,   { opacity: 1, duration: 0.3, ease: 'power2.out' })
    tl.to(container, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'expo.out' }, '-=0.15')

    return () => tl.kill()
  }, [])

  // ── Fecha com animação ───────────────────────────────────
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(containerRef.current, { opacity: 0, scale: 0.95, y: 8, duration: 0.25, ease: 'power2.in' })
    tl.to(overlayRef.current,   { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1')
  }

  // ── ESC fecha o modal ────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      // Bloqueia Ctrl+S dentro do modal
      if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    // Trava o scroll da página enquanto modal está aberto
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(10,8,6,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      {/* Container do vídeo — clique aqui não fecha */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1.5 font-sans text-[0.6rem] tracking-[0.2em] uppercase"
        >
          Fechar
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Wrapper com proteção de sobreposição */}
        <div
          className="relative w-full rounded-xl overflow-hidden bg-black"
          style={{ aspectRatio: '16/9' }}
          onContextMenu={e => e.preventDefault()}
        >
          <video
            ref={videoRef}
            src={video.src}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={e => e.preventDefault()}
            className="w-full h-full object-contain"
            style={{ display: 'block' }}
          />

          {/* Overlay transparente no topo: bloqueia arrastar / salvar via drag */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
            onContextMenu={e => e.preventDefault()}
            draggable={false}
          />
        </div>

        {/* Metadados do vídeo */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div>
            <p className="font-serif text-white text-base tracking-tight leading-tight">
              {video.title}
            </p>
            <p className="font-sans text-[0.52rem] tracking-[0.18em] uppercase text-white/40 mt-0.5">
              {video.category} — {video.year}
            </p>
          </div>
          <p className="font-sans text-[0.5rem] tracking-[0.14em] uppercase text-white/25">
            Lume Studio
          </p>
        </div>
      </div>
    </div>
  )
}

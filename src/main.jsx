import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style/global.css'

// ── Proteção de imagens ──────────────────────────────────────
// Bloqueia clique direito e arrastar em imagens e vídeos
document.addEventListener('contextmenu', e => {
  const tag = e.target.tagName
  if (tag === 'IMG' || tag === 'VIDEO' || e.target.closest('img, video')) {
    e.preventDefault()
  }
})

document.addEventListener('dragstart', e => {
  const tag = e.target.tagName
  if (tag === 'IMG' || tag === 'VIDEO') {
    e.preventDefault()
  }
})

// Bloqueia Ctrl+S (salvar página) e Ctrl+U (ver código-fonte)
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault()
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
    e.preventDefault()
  }
})
// ────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

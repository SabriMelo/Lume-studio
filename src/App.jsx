import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Críticos: carregam junto com o bundle principal
import Header        from './components/Header'
import Footer        from './components/Footer'
import HeroSection   from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen'

// Abaixo do fold: chunks separados, carregam em paralelo sem bloquear o render
const WorksPanel      = lazy(() => import('./components/WorksPanel'))
const BentoGallery    = lazy(() => import('./components/BentoGallery'))
const AboutSection    = lazy(() => import('./components/AboutSection'))
const ServicesSection = lazy(() => import('./components/ServicesSection'))
const ContactSection  = lazy(() => import('./components/ContactSection'))
const Projects        = lazy(() => import('./pages/Projects'))
const ProjectDetail   = lazy(() => import('./pages/ProjectDetail'))

gsap.registerPlugin(ScrollTrigger)

function Home() {
  return (
    // fallback null: componentes abaixo do fold não precisam de skeleton
    <Suspense fallback={null}>
      <HeroSection     />
      <WorksPanel      />
      <BentoGallery    />
      <AboutSection    />
      <ServicesSection />
      <ContactSection  />
    </Suspense>
  )
}

// ── Transição suave entre páginas ────────────────────────────
function PageTransition({ children }) {
  const location = useLocation()
  const wrapRef  = useRef(null)

  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    // 1. Mata os triggers PRIMEIRO — o kill() do pin pode restaurar scroll internamente
    ScrollTrigger.getAll().forEach(t => t.kill())

    // 2. Reseta scroll de todas as formas possíveis (instantâneo, sem smooth)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo(0, 0)

    if (wrapRef.current) wrapRef.current.style.opacity = '0'
  }, [location.pathname])

  useEffect(() => {
    const el = wrapRef.current
    const anim = gsap.to(el, {
      opacity: 1,
      duration: 0.32,
      ease: 'power2.out',
      onComplete: () => ScrollTrigger.refresh(),
    })
    return () => anim.kill()
  }, [location.pathname])

  return <div ref={wrapRef}>{children}</div>
}

function Layout() {
  const { pathname } = useLocation()
  const isDetail = /^\/projects\/\d+/.test(pathname)

  return (
    <>
      <Header />
      <main>
        <PageTransition>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/"             element={<Home />}          />
              <Route path="/projects"     element={<Projects />}      />
              <Route path="/projects/:id" element={<ProjectDetail />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      {!isDetail && <Footer />}
    </>
  )
}

export default function App() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <BrowserRouter>
      {showLoader && (
        <LoadingScreen onComplete={() => setShowLoader(false)} />
      )}
      <Layout />
    </BrowserRouter>
  )
}

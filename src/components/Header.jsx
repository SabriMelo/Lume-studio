import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home',     type: 'route',    to: '/'          },
  { label: 'Projetos', type: 'route',    to: '/projects'  },
  { label: 'Sobre',    type: 'section',  to: '/', hash: '#about'   },
  { label: 'Contato',  type: 'section',  to: '/', hash: '#contato' },
  { label: 'LumeDev',  type: 'external', href: 'https://lumestudio.dev.br' },
]

export default function Header() {
  const logoRef  = useRef(null)
  const navRef   = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    gsap.set([logoRef.current, navRef.current], { opacity: 0, y: -6 })
    const tl = gsap.timeline()
    tl
      .to(logoRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.2)
      .to(navRef.current,  { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.35)
    return () => tl.kill()
  }, [])

  const scrollToHash = (hash) => {
    const el = document.querySelector(hash)
    if (!el) return
    if (hash === '#about') {
      // Entra 120vh dentro da seção para o conteúdo já aparecer visível
      const top = el.getBoundingClientRect().top + window.pageYOffset + window.innerHeight * 1.2
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSectionLink = (e, hash) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToHash(hash), 400)
    } else {
      scrollToHash(hash)
    }
  }

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleProjectsClick = (e) => {
    if (location.pathname === '/projects') {
      e.preventDefault()
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo(0, 0)
    }
  }

  const linkClass = "font-sans text-[0.72rem] tracking-[0.16em] uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200"

  const renderLink = ({ label, type, to, hash, href }) => {
    if (type === 'section') return (
      <a href={hash} onClick={e => { handleSectionLink(e, hash); setOpen(false) }} className={linkClass}>{label}</a>
    )
    if (type === 'external') return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{label}</a>
    )
    return (
      <Link
        to={to}
        onClick={e => {
          if (to === '/') handleHomeClick(e)
          if (to === '/projects') handleProjectsClick(e)
          setOpen(false)
        }}
        className={linkClass}
      >{label}</Link>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 md:px-14 py-5 md:py-7 z-50">

        {/* Logo */}
        <Link to="/" ref={logoRef} className="font-serif text-[1.5rem] tracking-tight text-stone-900 select-none">
          Lume
        </Link>

        {/* Nav desktop */}
        <nav ref={navRef} className="hidden md:block">
          <ul className="flex gap-9 list-none">
            {NAV_LINKS.map(link => (
              <li key={link.label}>{renderLink(link)}</li>
            ))}
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-stone-900 transition-transform duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-px bg-stone-900 transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-stone-900 transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>

      </header>

      {/* Menu mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-[#f0ede6] flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col items-center gap-8 list-none">
          {NAV_LINKS.map(link => (
            <li key={link.label} className="text-[1.1rem]">{renderLink(link)}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

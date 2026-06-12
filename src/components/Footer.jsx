import { Link } from 'react-router-dom'

const NAV = [
  { label: 'Home',     to: '/'         },
  { label: 'Projetos', to: '/projects' },
  { label: 'Sobre',    href: '/#about'    },
  { label: 'Contato',  href: '/#contato'  },
  { label: 'LumeDev',  href: 'https://lumestudio.dev.br', external: true },
]

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#f0ede6] border-t border-stone-200 px-10 md:px-20 py-6">
      <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-0">

        {/* Esquerda — copyright */}
        <p className="font-sans text-[0.65rem] tracking-wide text-stone-400 text-center md:text-left order-3 md:order-1">
          © {new Date().getFullYear()} Lume Studio. All rights reserved.
        </p>

        {/* Centro — logo */}
        <span className="font-serif text-[1.3rem] tracking-tight text-stone-600 select-none text-center order-1 md:order-2">
          Lume
        </span>

        {/* Direita — nav + social */}
        <div className="flex items-center gap-6 justify-center md:justify-end order-2 md:order-3">
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 list-none">
              {NAV.map(({ label, to, href, external }) => (
                <li key={label}>
                  {to ? (
                    <Link
                      to={to}
                      className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-stone-400 hover:text-stone-900 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-stone-400 hover:text-stone-900 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Divisor */}
          <span className="hidden md:block w-px h-3 bg-stone-300" />

          {/* Social */}
          <div className="flex items-center gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5581992809343"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-stone-400 hover:text-stone-900 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:contato@lumestudio3d.com.br"
              aria-label="E-mail"
              className="text-stone-400 hover:text-stone-900 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

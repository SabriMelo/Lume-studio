import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'

gsap.registerPlugin(ScrollTrigger)

// ── Preencha com suas credenciais do EmailJS ─────────────────
// Crie sua conta em: https://www.emailjs.com
// Dashboard → Email Services → Service ID
// Dashboard → Email Templates → Template ID
// Dashboard → Account → Public Key
const EMAILJS_SERVICE_ID  = 'service_zr2yuzh'
const EMAILJS_TEMPLATE_ID = 'template_76ag3z7'
const EMAILJS_PUBLIC_KEY  = 'JfiV22EM72h3pA4NI'

const CAROUSEL_IMAGES = [
  '/hero/escrit-1.webp',
  '/hero/HALL_casaorange.webp',
  '/hero/HALL3.webp',
  '/hero/casa-fr-1.webp',
  '/hero/01.webp',
]

export default function ContactSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const fieldRefs  = useRef([])
  const btnRef     = useRef(null)
  const imgRefs    = useRef([])
  const current    = useRef(0)
  const timerRef   = useRef(null)

  // Animação de entrada dos campos
  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(fieldRefs.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.10,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      )

      gsap.fromTo(btnRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
          delay: 0.45,
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Carousel auto-loop com crossfade
  useEffect(() => {
    const imgs = imgRefs.current
    gsap.set(imgs, { opacity: 0 })
    gsap.set(imgs[0], { opacity: 1 })

    const advance = () => {
      const prev = current.current
      const next = (prev + 1) % imgs.length
      gsap.to(imgs[prev], { opacity: 0, duration: 1.2, ease: 'power2.inOut' })
      gsap.to(imgs[next], { opacity: 1, duration: 1.2, ease: 'power2.inOut' })
      current.current = next
    }

    timerRef.current = setInterval(advance, 3500)
    return () => clearInterval(timerRef.current)
  }, [])

  const [form,   setForm]   = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    form.name,
          from_email:   form.email,
          celular:      form.phone,
          message:      form.message,
          reply_to:     form.email,
        },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={sectionRef} id="contato" className="relative z-10 bg-[#f0ede6] min-h-screen flex flex-col md:flex-row">

      {/* ── ESQUERDA: carrossel ── */}
      <div className="hidden md:block relative md:w-1/2 overflow-hidden" style={{ minHeight: '100vh' }}>
        {CAROUSEL_IMAGES.map((src, i) => (
          <img
            key={i}
            ref={el => { imgRefs.current[i] = el }}
            src={src}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}
      </div>

      {/* ── DIREITA: formulário ── */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-20">

        <h2
          ref={titleRef}
          className="font-serif italic font-normal text-stone-900 mb-14 tracking-tight"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', opacity: 0 }}
        >
          Contato
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">

          {[
            { name: 'name',  label: 'Nome',   placeholder: 'Nome Completo',    type: 'text'  },
            { name: 'email', label: 'E-mail', placeholder: 'Seu@email.com',    type: 'email' },
            { name: 'phone', label: 'Telefone',  placeholder: '+55 (00) 00000-0000', type: 'tel' },
          ].map((field, i) => (
            <div
              key={field.name}
              ref={el => { fieldRefs.current[i] = el }}
              className="border-b border-stone-300 pt-4 pb-2"
              style={{ opacity: 0 }}
            >
              <span className="block font-sans text-[0.62rem] tracking-[0.18em] uppercase text-stone-400 mb-2">
                {field.label}
              </span>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full bg-transparent font-sans text-[1rem] tracking-wide text-stone-800 placeholder:text-stone-300 outline-none pb-1"
              />
            </div>
          ))}

          {/* Message */}
          <div
            ref={el => { fieldRefs.current[3] = el }}
            className="border-b border-stone-300 pt-4 pb-2"
            style={{ opacity: 0 }}
          >
            <span className="block font-sans text-[0.62rem] tracking-[0.18em] uppercase text-stone-400 mb-2">
              Mensagem
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Conte-me mais sobre o seu projeto ou ideia"
              rows={4}
              className="w-full bg-transparent font-sans text-[1rem] tracking-wide text-stone-800 placeholder:text-stone-300 outline-none resize-none pb-1"
            />
          </div>

          {/* Submit */}
          <div ref={btnRef} className="mt-10 flex flex-col-reverse md:flex-row items-center md:justify-between gap-4" style={{ opacity: 0 }}>

            {/* Feedback */}
            <p className={`font-sans text-[0.62rem] tracking-[0.12em] transition-opacity duration-300 ${
              status === 'success' ? 'text-stone-500 opacity-100' :
              status === 'error'   ? 'text-red-400 opacity-100'   : 'opacity-0'
            }`}>
              {status === 'success' && 'Mensagem enviada com sucesso.'}
              {status === 'error'   && 'Erro ao enviar. Tente novamente.'}
            </p>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="font-sans text-[0.72rem] tracking-[0.18em] uppercase text-stone-600 hover:text-stone-900 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed px-9 py-3.5 rounded-sm transition-colors duration-300"
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar Mensagem'}
            </button>

          </div>

        </form>
      </div>
    </section>
  )
}

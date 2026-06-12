# Lume Studio

Site institucional do **Lume Studio**, estúdio de visualização 3D arquitetônica em Recife, PE. Apresenta o portfólio de renders de interiores, fachadas e empreendimentos, com galeria de projetos filtrável, páginas de detalhe e formulário de contato.

## Stack

- **React 19** + **Vite** (build e dev server)
- **React Router DOM** (navegação SPA)
- **Tailwind CSS v4** (estilização)
- **GSAP** + ScrollTrigger (animações e carrossel)
- **EmailJS** (envio do formulário de contato sem backend)

## Scripts

```bash
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção (saída em dist/)
npm run preview  # preview do build de produção
```

## Deploy

O conteúdo de `dist/` é hospedado na Hostinger (Apache), com `.htaccess` cuidando do roteamento SPA, compressão Gzip e cache de assets.

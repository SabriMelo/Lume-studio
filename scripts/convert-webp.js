import sharp from 'sharp'
import { readdirSync, statSync, unlinkSync, chmodSync, existsSync } from 'fs'
import { join, extname, basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../public/projects')

const EXTS    = ['.jpg', '.jpeg', '.png']
const QUALITY = 82

let total = 0
let done  = 0
let erros = 0

// Coleta todos os arquivos recursivamente
function listar(dir) {
  const arquivos = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      arquivos.push(...listar(full))
    } else if (EXTS.includes(extname(entry.name).toLowerCase())) {
      arquivos.push(full)
    }
  }
  return arquivos
}

async function converter(src) {
  const dest = join(
    src.substring(0, src.length - extname(src).length) + '.webp'
  )

  try {
    // Converte só se o .webp não existe ou o original é mais novo
    const jaExiste = existsSync(dest) &&
      statSync(dest).mtimeMs >= statSync(src).mtimeMs

    if (!jaExiste) {
      await sharp(src).webp({ quality: QUALITY }).toFile(dest)
      console.log(`  ✓  ${basename(dest)}`)
    } else {
      console.log(`  ↷  já convertido: ${basename(src)}`)
    }

    // Sempre tenta apagar o original (força permissão antes)
    try { chmodSync(src, 0o666) } catch {}
    unlinkSync(src)
    done++
  } catch (err) {
    erros++
    console.error(`  ✗  ${basename(src)} — ${err.message}`)
  }
}

async function main() {
  const arquivos = listar(ROOT)
  total = arquivos.length

  console.log(`\nConvertendo ${total} imagens para WebP (qualidade ${QUALITY})...\n`)

  // Processa em lotes de 8 para não travar o processo
  const LOTE = 8
  for (let i = 0; i < arquivos.length; i += LOTE) {
    await Promise.all(arquivos.slice(i, i + LOTE).map(converter))
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`  Convertidas : ${done}`)
  console.log(`  Erros       : ${erros}`)
  console.log(`  Total       : ${total}`)
  console.log(`─────────────────────────────────\n`)
}

main()

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const APP_DIR = fileURLToPath(new URL('..', import.meta.url))
const HTML_PATH = path.join(APP_DIR, 'dist', 'index.html')

async function prerender() {
  const serverDir = await mkdtemp(path.join(APP_DIR, 'dist', '.prerender-'))

  try {
    await build({
      root: APP_DIR,
      logLevel: 'warn',
      build: {
        ssr: 'src/entry-server.jsx',
        outDir: serverDir,
        copyPublicDir: false,
      },
    })

    const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
    const { services } = JSON.parse(await readFile(
      path.join(APP_DIR, 'src', 'data', 'services.json'), 'utf8'
    ))
    const template = await readFile(HTML_PATH, 'utf8')
    const rootPlaceholder = '<div id="root"></div>'

    if (!template.includes(rootPlaceholder)) {
      throw new Error('The HTML template is missing the prerender placeholder.')
    }

    const html = template.replace(
      rootPlaceholder, () => `<div id="root" data-prerendered="true">${render()}</div>`
    )

    await writeFile(HTML_PATH, html)
    console.log(`Prerendered ${services.length} services into dist/index.html.`)
  } finally {
    await rm(serverDir, { recursive: true, force: true })
  }
}

prerender().catch((error) => {
  console.error('Error prerendering the directory:', error)
  process.exitCode = 1
})

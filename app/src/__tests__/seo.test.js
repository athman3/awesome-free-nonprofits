import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'

const DIST_DIR = new URL('../../dist/', import.meta.url)
const html = await readFile(new URL('index.html', DIST_DIR), 'utf8')
const { services } = JSON.parse(await readFile(
  new URL('../data/services.json', import.meta.url), 'utf8'
))

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;',
  })[character])
}

test('the initial HTML includes every service and its offer without JavaScript', () => {
  const root = html.match(/<div id="root" data-prerendered="true">([\s\S]*)<\/div>/)?.[1]
  assert.ok(root, 'The production page must include a prerendered React root.')
  assert.equal((root.match(/<h3>/g) || []).length, services.length)

  for (const service of services) {
    assert.ok(root.includes(`<h3>${escapeHtml(service.name)}</h3>`), service.name)
    assert.ok(root.includes(escapeHtml(service.offer)), `${service.name} offer`)
    assert.ok(root.includes(`href="${escapeHtml(service.url)}"`), `${service.name} program link`)
  }

  assert.equal((root.match(/<h1\b/g) || []).length, 1)
})

test('structured data describes the visible services in their displayed order', () => {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  assert.equal(scripts.length, 1)
  const data = JSON.parse(scripts[0][1])
  const collection = data['@graph'].find((item) => item['@type'] === 'CollectionPage')
  const expectedServices = [...services].sort((a, b) =>
    (b.score || 0) - (a.score || 0) || a.name.localeCompare(b.name)
  )

  assert.equal(collection.url, 'https://nonprofits.athman3.com/')
  assert.equal(collection.mainEntity.numberOfItems, services.length)
  assert.deepEqual(
    collection.mainEntity.itemListElement.map(({ position, item }) => [position, item.name, item.url]),
    expectedServices.map((service, index) => [index + 1, service.name, service.url])
  )
})

test('canonical metadata and the sitemap agree without fabricated modification dates', async () => {
  const sitemap = await readFile(new URL('sitemap.xml', DIST_DIR), 'utf8')
  assert.match(html, /<link rel="canonical" href="https:\/\/nonprofits\.athman3\.com\/"/)
  assert.match(sitemap, /<loc>https:\/\/nonprofits\.athman3\.com\/<\/loc>/)
  assert.doesNotMatch(sitemap, /<lastmod>|<priority>|<changefreq>/)
  assert.doesNotMatch(html, /Please enable JavaScript/)
})

test('temporary server bundles are excluded from the published directory', async () => {
  const entries = await readdir(DIST_DIR)
  assert.equal(entries.some((name) => name.startsWith('.prerender-')), false)
})

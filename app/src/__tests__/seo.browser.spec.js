import { expect, test } from '@playwright/test'

async function expectSchemaMatchesResults(page) {
  const names = await page.locator('main .grid h3').allTextContents()
  const script = page.locator('script[type="application/ld+json"]')
  await expect(script).toHaveCount(1)
  const data = JSON.parse(await script.textContent())
  const list = data['@graph'].find(item => item['@type'] === 'CollectionPage').mainEntity

  expect(list.numberOfItems).toBe(names.length)
  expect(list.itemListElement.map(({ position, item }) => [position, item.name]))
    .toEqual(names.map((name, index) => [index + 1, name]))
}

test('search typed before React loads preserves results, URL, focus and selection', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  let releaseModule
  const moduleGate = new Promise(resolve => { releaseModule = resolve })
  await page.route('**/assets/*.js', async route => {
    await moduleGate
    await route.continue()
  })
  const input = page.getByPlaceholder('Cloud, Design...')

  try {
    await page.goto('/', { waitUntil: 'commit' })
    await input.fill('canva')
    await input.evaluate(element => element.setSelectionRange(1, 4, 'backward'))
  } finally {
    releaseModule()
  }

  await expect(page.locator('main .grid > div')).toHaveCount(1)
  await expect(page).toHaveURL(/\?q=canva$/)
  await expect(input).toHaveValue('canva')
  await expect(input).toBeFocused()
  expect(await input.evaluate(element => [
    element.selectionStart, element.selectionEnd, element.selectionDirection,
  ])).toEqual([1, 4, 'backward'])
  await expectSchemaMatchesResults(page)

  await input.fill('google')
  await expect(page).toHaveURL(/\?q=google$/)
  await expect(page.locator('main .grid h3')).toHaveText(['Google'])
  expect(errors).toEqual([])
})

test('structured data matches direct links and interactive filter changes', async ({ page }) => {
  const cards = page.locator('main .grid > div')
  for (const [url, count] of [
    ['/', 34],
    ['/?category=Design+%26+Creative', 3],
    ['/?q=canva', 1],
    ['/?q=xyznonexistent', 0],
  ]) {
    await page.goto(url)
    await expect(cards).toHaveCount(count)
    await expectSchemaMatchesResults(page)
  }

  const input = page.getByPlaceholder('Cloud, Design...')
  await input.fill('canva')
  await expect(cards).toHaveCount(1)
  await expectSchemaMatchesResults(page)
  await input.fill('')
  await expect(cards).toHaveCount(34)
  await page.locator('main > .space-y-8').getByText('Design & Creative', { exact: true }).click()
  await expect(cards).toHaveCount(3)
  await expectSchemaMatchesResults(page)
  await input.fill('xyznonexistent')
  await expect(cards).toHaveCount(0)
  await expectSchemaMatchesResults(page)
  await page.getByRole('button', { name: 'Clear Filters' }).click()
  await expect(cards).toHaveCount(34)
  await expectSchemaMatchesResults(page)
})

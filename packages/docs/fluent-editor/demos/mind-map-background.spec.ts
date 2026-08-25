import { expect, test } from '@playwright/test'

test('renders mind map with custom background color', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/mind-map')

  const block = page.locator('.vp-raw').nth(1)
  const toolbar = block.locator('.ql-toolbar').first()
  const map = block.locator('.ql-mind-map-item').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(toolbar.locator('.ql-mind-map')).toBeVisible()
  await expect(map).toBeVisible({ timeout: 30_000 })
  await expect(map).toContainText('根节点')

  await expect.poll(async () => {
    const color = await map.evaluate((el) => {
      const svg = el.querySelector('svg')
      const style = svg ? getComputedStyle(svg) : getComputedStyle(el)
      return `${(el as HTMLElement).style.backgroundColor} ${style.backgroundColor}`
    })
    return color.includes('164, 221, 0') || color.toLowerCase().includes('a4dd00')
  }).toBeTruthy()
})

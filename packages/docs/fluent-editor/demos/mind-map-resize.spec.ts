import { expect, test } from '@playwright/test'

test('renders mind map with resize handles', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/mind-map')

  const block = page.locator('.vp-raw').nth(2)
  const toolbar = block.locator('.ql-toolbar').first()
  const map = block.locator('.ql-mind-map-item').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(toolbar.locator('.ql-mind-map')).toBeVisible()
  await expect(map).toBeVisible({ timeout: 30_000 })
  await expect(map.locator('.ql-mind-map-resize-handle')).toHaveCount(4)
})

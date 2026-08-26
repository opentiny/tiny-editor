import { expect, test } from '@playwright/test'

test('has screenshot button in toolbar', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/screenshot')

  const block = page.locator('.vp-raw').first()
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(toolbar.locator('.ql-screenshot')).toBeVisible()
})

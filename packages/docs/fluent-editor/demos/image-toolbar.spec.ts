import { expect, test } from '@playwright/test'

test('shows image toolbar overlay and preview button', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/image-tool')

  const block = page.locator('.vp-raw').first()
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const image = editor.getByRole('img').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(image).toBeVisible({ timeout: 30_000 })

  await image.click()
  const overlay = page.locator('.blot-formatter__overlay')
  await expect(overlay).toBeVisible()
  const buttons = overlay.locator('.blot-formatter__toolbar-button')
  await expect(buttons).toHaveCount(6)

  await buttons.last().click({ force: true })
  await expect(page.locator('.image-preview-overlay')).toBeVisible()
})

import { expect, test } from '@playwright/test'

test('custom image toolbar hides copy/download and applies clean', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/image-tool')

  const block = page.locator('.vp-raw').nth(1)
  const editor = block.locator('.ql-editor').first()
  const image = editor.getByRole('img').first()

  await expect(image).toBeVisible({ timeout: 30_000 })
  await expect(image).toHaveAttribute('width', '400px')

  await image.click()
  const overlay = page.locator('.blot-formatter__overlay')
  await expect(overlay).toBeVisible()
  const buttons = overlay.locator('.blot-formatter__toolbar-button')
  await expect(buttons).toHaveCount(5)

  await buttons.last().click({ force: true })
  await expect(image).not.toHaveAttribute('width', '400px')
})

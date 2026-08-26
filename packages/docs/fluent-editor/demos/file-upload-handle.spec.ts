import { expect, test } from '@playwright/test'

const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

test('uploads image and uses fail handler placeholder', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/file-upload')

  const block = page.locator('.vp-raw').nth(1)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(toolbar.getByLabel('image')).toBeVisible()
  await expect(toolbar.getByLabel('video')).toBeVisible()
  await expect(toolbar.getByLabel('file')).toBeVisible()

  await toolbar.getByLabel('image').click()
  await toolbar.locator('input.ql-image').setInputFiles({
    name: 'a.png',
    mimeType: 'image/png',
    buffer: pngBuffer,
  })

  const image = editor.getByRole('img').first()
  await expect(image).toBeVisible({ timeout: 10_000 })
  await expect(image).toHaveAttribute('src', /edge/)
})

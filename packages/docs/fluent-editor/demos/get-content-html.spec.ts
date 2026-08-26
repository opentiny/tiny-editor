import { expect, test } from '@playwright/test'

const initialHtml = [
  '<p>',
  'Hello ',
  '<strong>TinyEditor</strong>',
  '!',
  '</p>',
].join('')

test('has toolbar and syncs HTML preview on text change', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/get-content')

  const block = page.locator('.vp-raw').filter({ has: page.locator('#editor-get-content-html') })
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = page.locator('#editor-get-content-html .ql-editor')
  const preview = block.locator('.article.ql-editor')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(preview).toBeVisible({ timeout: 30_000 })
  await expect(await editor.innerHTML()).toEqual(initialHtml)
  await expect(await preview.innerHTML()).toEqual(initialHtml)

  await editor.click()
  await page.keyboard.type(' More')
  await expect(await preview.innerHTML()).toEqual(await editor.innerHTML())
  await expect(preview).toContainText('More')
})

import { expect, test } from '@playwright/test'

test('has toolbar and syncs Delta preview on text change', async ({ page }) => {
  await page.goto('http://localhost:5173/tiny-editor/docs/demo/get-content')

  const block = page.locator('.vp-raw').filter({ has: page.locator('#editor-get-content-delta') })
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = page.locator('#editor-get-content-delta .ql-editor')
  const preview = block.locator('.article.ql-editor')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(preview).toBeVisible({ timeout: 30_000 })
  await expect(editor).toContainText('Hello')
  await expect(editor).toContainText('TinyEditor')

  const initialDelta = JSON.parse(await preview.innerText())
  expect(initialDelta.ops).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ insert: 'Hello ' }),
      expect.objectContaining({ insert: 'TinyEditor', attributes: { bold: true } }),
      expect.objectContaining({ insert: '!\n' }),
    ]),
  )

  await editor.click()
  await page.keyboard.type(' More')
  await expect(preview).toContainText('More')

  const updatedDelta = JSON.parse(await preview.innerText())
  expect(updatedDelta.ops).toEqual(
    expect.arrayContaining([expect.objectContaining({ insert: expect.stringContaining('More') })]),
  )
})

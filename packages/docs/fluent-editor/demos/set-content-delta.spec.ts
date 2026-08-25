import { expect, test } from '@playwright/test'

test('should initialize editor with Delta content', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/set-content')

  const toolbar = page.locator('.ql-toolbar').nth(1)
  const editor = page.locator('#editor-set-content-delta .ql-editor')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(await editor.innerHTML()).toEqual(
    [
      '<p>',
      'Hello ',
      '<strong>TinyEditor</strong>',
      '!',
      '</p>',
    ].join(''),
  )
})

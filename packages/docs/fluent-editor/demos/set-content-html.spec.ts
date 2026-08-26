import { expect, test } from '@playwright/test'

test('should initialize editor with HTML content', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/set-content')

  const editor = page.locator('#editor-set-content-html .ql-editor')
  await expect(editor).toBeVisible()

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

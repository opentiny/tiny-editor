import { expect, test } from '@playwright/test'

test('has toolbar', async ({ page }) => {
  // page.on('pageerror', exception => expect(exception).toBeNull())
  await page.goto('/tiny-editor/docs/demo/basic-usage')

  const toolbar = page.locator('.ql-toolbar')
  const editor = page.locator('.ql-editor')

  await expect(toolbar).toBeVisible()
  await expect(await editor.innerHTML()).toEqual(
    [
      '<p>',
      'Hello ',
      `<strong>TinyEditor</strong>`,
      '!',
      `</p>`,
    ].join(''),
  )
})

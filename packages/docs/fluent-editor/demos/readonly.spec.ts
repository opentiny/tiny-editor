import { expect, test } from '@playwright/test'

const initialHtml = [
  '<p>',
  'Hello ',
  '<strong>TinyEditor</strong>',
  '!',
  '</p>',
  '<p>',
  '官网: ',
  '<a class="ql-normal-link" href="https://opentiny.github.io/tiny-editor" target="_blank">https://opentiny.github.io/tiny-editor</a>',
  '</p>',
  '<p>',
  'GitHub: ',
  '<a class="ql-normal-link" href="https://github.com/opentiny/tiny-editor" target="_blank">https://github.com/opentiny/tiny-editor</a>',
  '</p>',
].join('')

test('renders readonly editor without toolbar', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/readonly')

  const block = page.locator('.vp-raw').first()
  const editor = page.locator('#editor-readonly .ql-editor')

  await expect(block.locator('.ql-toolbar')).toHaveCount(0)
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(editor).toHaveAttribute('contenteditable', 'false')
  await expect(await editor.innerHTML()).toEqual(initialHtml)

  await editor.click()
  await page.keyboard.type('test')
  await expect(await editor.innerHTML()).toEqual(initialHtml)
})

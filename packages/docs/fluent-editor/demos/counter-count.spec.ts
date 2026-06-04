import { expect, test } from '@playwright/test'

test('has toolbar and custom max character counter', async ({ page }) => {
  await page.goto('http://localhost:5173/tiny-editor/docs/demo/counter')

  const toolbar = page.locator('.ql-toolbar').nth(1)
  const editor = page.locator('.ql-editor').nth(1)
  const counter = page.locator('.ql-counter').nth(1)

  await expect(toolbar).toBeVisible()
  await expect(editor).toBeVisible()
  await expect(counter).toBeVisible()
  await expect(counter).toHaveText('0/2000 characters')

  await editor.click()
  await page.keyboard.type('abc')
  await expect(counter).toHaveText('3/2000 characters')
})

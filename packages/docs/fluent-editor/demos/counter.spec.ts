import { expect, test } from '@playwright/test'

test('has toolbar and default max character counter', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/counter')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('.ql-editor').first()
  const counter = page.locator('.ql-counter').first()

  await expect(toolbar).toBeVisible()
  await expect(editor).toBeVisible()
  await expect(counter).toBeVisible()
  await expect(counter).toHaveText('0/500 characters')

  await editor.click()
  await page.keyboard.type('abc')
  await expect(counter).toHaveText('3/500 characters')
})

import { expect, test } from '@playwright/test'

test('has toolbar and converts markdown shortcuts', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/markdown')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('#editor .ql-editor')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })

  await editor.click()
  await page.keyboard.type('# Hello')
  await expect(editor.locator('h1')).toHaveText('Hello')

  await page.keyboard.press('Enter')
  await page.keyboard.type('- item')
  await expect(editor.locator('li').first()).toContainText('item')
})

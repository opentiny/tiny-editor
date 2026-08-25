import { expect, test } from '@playwright/test'

test('shows shortcut placeholder and opens slash menu', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/shortcut-key')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('#editor .ql-editor')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.qsf-placeholder__wrapper')).toBeVisible()

  await editor.click()
  await page.keyboard.type('/')
  const menu = page.locator('.qsf-menu')
  await expect(menu).toBeVisible({ timeout: 10_000 })
  await expect(menu).toContainText('Heading 1')
})

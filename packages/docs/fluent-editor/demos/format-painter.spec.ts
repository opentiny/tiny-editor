import { expect, test } from '@playwright/test'

test('copies bold format with format painter', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/format-painter')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('#editor .ql-editor')
  const painterBtn = toolbar.locator('.ql-format-painter')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(painterBtn).toBeVisible()

  await editor.click()
  await toolbar.locator('.ql-bold').click()
  await page.keyboard.type('Bold')
  await page.keyboard.press('ControlOrMeta+a')
  await painterBtn.click()
  await expect(painterBtn).toHaveClass(/ql-active/)

  await page.keyboard.press('End')
  await page.keyboard.type(' Text')
  await expect(editor.locator('strong')).toContainText('Bold')
  await expect(editor.locator('strong')).toContainText('Text')
})

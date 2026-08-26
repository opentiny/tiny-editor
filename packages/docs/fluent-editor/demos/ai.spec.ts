import { expect, test } from '@playwright/test'

test('has toolbar AI button and opens AI input dialog', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/ai')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('#editor-add-toolbar-item .ql-editor')
  const aiBtn = toolbar.locator('.ql-ai')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(editor).toContainText('我曾经跨过山和大海')
  await expect(aiBtn).toBeVisible()

  await editor.click()
  await aiBtn.click()
  await expect(page.locator('.ql-ai-dialog')).toBeVisible()
  await expect(page.locator('.ql-ai-input')).toBeVisible()
})

import { expect, test } from '@playwright/test'

test('has toolbar and pasteStyleSheet clipboard demo', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/table-up')

  const block = page.locator('.vp-raw').nth(3)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(block).toContainText('pasteStyleSheet')
  await expect(toolbar.locator('.ql-picker.ql-table-up')).toBeVisible()
})

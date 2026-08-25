import { expect, test } from '@playwright/test'

test('renders full custom toolbar with extra tools and placeholder', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/custom-toolbar')

  const block = page.locator('.vp-raw').first()
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(editor).toHaveAttribute('data-placeholder', '请输入内容...')
  await expect(toolbar.locator('.ql-undo')).toBeVisible()
  await expect(toolbar.locator('.ql-redo')).toBeVisible()
  await expect(toolbar.locator('.ql-emoji')).toBeVisible()
  await expect(toolbar.locator('.ql-screenshot')).toBeVisible()
  await expect(toolbar.locator('.ql-format-painter')).toBeVisible()
  await expect(toolbar.locator('.ql-picker.ql-font')).toBeVisible()
})

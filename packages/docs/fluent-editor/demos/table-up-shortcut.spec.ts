import { expect, test } from '@playwright/test'

test('has language switcher, table button and slash menu table item', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/table-up')

  const block = page.locator('.vp-raw').nth(2)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const localeSelect = block.locator('#locale-select')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(localeSelect).toBeVisible()
  await expect(toolbar.locator('.ql-picker.ql-table-up')).toBeVisible()

  await editor.click()
  await page.keyboard.type('/')
  const menu = page.locator('.qsf-menu')
  await expect(menu).toBeVisible({ timeout: 10_000 })
  await expect(menu).toContainText(/Table|表格/)
})

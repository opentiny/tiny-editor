import { expect, test } from '@playwright/test'

test('renders three table resize editors and inserts a table', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/table-up')

  const block = page.locator('.vp-raw').nth(1)
  const editors = block.locator('.ql-editor')
  await expect(editors.first()).toBeVisible({ timeout: 30_000 })
  await expect(editors).toHaveCount(3)
  await expect(block).toContainText('包围盒')
  await expect(block).toContainText('内部隐藏线')
  await expect(block).toContainText('整体单元格调整')

  const firstToolbar = block.locator('.ql-toolbar').first()
  await firstToolbar.locator('.ql-table-up > .ql-picker-label').click()
  await page.locator('.table-up-select-box__item[data-row="2"][data-col="2"]:visible').click()
  await expect(editors.first().locator('.ql-table-wrapper')).toBeVisible()
})

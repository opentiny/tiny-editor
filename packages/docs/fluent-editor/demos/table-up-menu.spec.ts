import { expect, test } from '@playwright/test'

test('inserts table from toolbar in contextmenu and select menu editors', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/table-up')

  const block = page.locator('.vp-raw').first()
  const editors = block.locator('.ql-editor')
  await expect(editors.first()).toBeVisible({ timeout: 30_000 })
  await expect(editors).toHaveCount(2)
  await expect(block).toContainText('右击菜单')
  await expect(block).toContainText('选择菜单')

  const firstToolbar = block.locator('.ql-toolbar').first()
  await firstToolbar.locator('.ql-table-up > .ql-picker-label').click()
  await page.locator('.table-up-select-box__item[data-row="2"][data-col="2"]:visible').click()
  await expect(editors.first().locator('.ql-table-wrapper')).toBeVisible()
})

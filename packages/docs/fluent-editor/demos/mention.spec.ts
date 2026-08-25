import { expect, test } from '@playwright/test'

test('shows mention list on @ and inserts selected item', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/mention')

  const block = page.locator('.vp-raw').filter({ has: page.locator('#editor') })
  const editor = page.locator('#editor .ql-editor')
  await expect(editor).toBeVisible({ timeout: 30_000 })

  await editor.click()
  await editor.pressSequentially('@')
  const list = block.locator('.ql-mention-list:not(.ql-mention-list--hide)')
  await expect(list).toBeVisible()
  await expect(list).toContainText('Jack 杰克')
  await expect(list).toContainText('Lucy 露西')

  await list.locator('.ql-mention-item').first().click()
  await expect(editor.locator('.ql-mention-link')).toContainText('Jack 杰克')
})

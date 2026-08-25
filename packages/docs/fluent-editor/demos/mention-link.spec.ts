import { expect, test } from '@playwright/test'

test('inserts mention link and toggles editable state', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/mention')

  const block = page.locator('.vp-raw').nth(2)
  const editor = block.locator('.ql-editor').first()
  const toggleBtn = block.getByRole('button', { name: /toggle editable/i })

  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(toggleBtn).toBeVisible()
  await expect(block).toContainText('enabled')

  await editor.click()
  await editor.pressSequentially('@')
  const list = block.locator('.ql-mention-list:not(.ql-mention-list--hide)')
  await expect(list).toBeVisible()
  await expect(list).toContainText('Jack 杰克')
  await list.locator('.ql-mention-item').first().click()

  const mention = editor.locator('a.ql-mention-link')
  await expect(mention).toHaveAttribute('href', '#/use/Jack')
  await expect(mention).toHaveAttribute('target', '_blank')

  await toggleBtn.click()
  await expect(block).toContainText('disabled')
  await expect(editor).toHaveAttribute('contenteditable', 'false')
})

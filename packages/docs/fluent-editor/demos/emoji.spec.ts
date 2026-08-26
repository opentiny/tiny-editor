import { expect, test } from '@playwright/test'

test('has toolbar emoji button and opens emoji picker', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/emoji')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('#editor .ql-editor')
  const emojiBtn = toolbar.locator('.ql-emoji')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(emojiBtn).toBeVisible()

  await editor.click()
  await emojiBtn.click()
  await expect(page.locator('#emoji-picker')).toBeVisible()
})

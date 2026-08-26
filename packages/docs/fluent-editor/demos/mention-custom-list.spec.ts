import { expect, test } from '@playwright/test'

test('renders custom mention list with avatar and follower info', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/mention')

  const editor = page.locator('#editor-mention-custom-list .ql-editor')
  await expect(editor).toBeVisible({ timeout: 30_000 })

  await editor.click()
  await editor.pressSequentially('@')
  const list = page.locator('.ql-mention-list-container__custom-list .ql-mention-list:not(.ql-mention-list--hide)')
  await expect(list).toBeVisible()
  await expect(list.locator('.item-name')).toContainText(['卡哥', '超哥', '小伍哥'])
  await expect(list.locator('.item-desc').first()).toContainText('粉丝')
  await expect(list.locator('.item-avatar img').first()).toBeVisible()

  await list.locator('.ql-mention-item').first().click()
  await expect(editor.locator('.ql-mention-link')).toContainText('卡哥')
})

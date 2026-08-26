import { expect, test } from '@playwright/test'

test('has toolbar and shows tip on hover', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/toolbar-tip')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('.ql-editor').first()
  const boldBtn = toolbar.locator('.ql-bold')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(boldBtn).toBeVisible()

  await boldBtn.hover()
  const tip = page.locator('.toolbar-tip__tooltip:visible')
  await expect(tip).toBeVisible({ timeout: 5_000 })
  await expect(tip).toContainText(/Bold|粗体/)
})

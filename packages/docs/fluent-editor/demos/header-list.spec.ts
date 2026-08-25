import { expect, test } from '@playwright/test'

test('has toolbar, headings and toggles header list panel', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/header-list')

  const block = page.locator('.vp-raw').nth(0)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const headerList = page.locator('.header-list').nth(0)
  const headerListBtn = toolbar.locator('.ql-header-list')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(headerListBtn).toBeVisible()
  await expect(editor.locator('h1').first()).toHaveText('header 1')
  await expect(headerList).toHaveClass(/is-hidden/)

  await headerListBtn.click()
  await expect(headerList).not.toHaveClass(/is-hidden/)
  await expect(headerList).toContainText('header 1')
  await expect(headerList).toContainText('header 1.1')
  await expect(headerList).toContainText('header 2')

  await headerListBtn.click()
  await expect(headerList).toHaveClass(/is-hidden/)
})

import { expect, test } from '@playwright/test'

test('uses custom i18n tip texts and switches locale', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/i18n')

  const block = page.locator('.vp-raw').nth(1)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const boldBtn = toolbar.locator('.ql-bold')
  const switchBtn = block.getByRole('button', { name: /switch between Chinese and English/i })
  const tip = page.locator('.toolbar-tip__tooltip:visible')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(boldBtn).toBeVisible()

  await boldBtn.hover()
  await expect(tip).toBeVisible({ timeout: 5_000 })
  await expect(tip).toHaveText('替换粗体文本')

  await switchBtn.click()
  await boldBtn.hover()
  await expect(tip).toHaveText('Replace bold text')
})

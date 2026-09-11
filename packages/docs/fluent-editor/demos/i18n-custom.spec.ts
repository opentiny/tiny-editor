import { type Locator, expect, test } from '@playwright/test'

async function hoverUntilTipVisible(button: Locator, tip: Locator) {
  await button.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'nearest' }))
  await expect(async () => {
    await button.hover()
    await expect(tip).toBeVisible({ timeout: 1_000 })
  }).toPass({ timeout: 15_000 })
}

test('uses custom i18n tip texts and switches locale', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/i18n')

  const block = page.locator('.vp-raw').nth(1)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const boldBtn = toolbar.locator('.ql-bold')
  const switchBtn = block.getByRole('button', { name: /switch between Chinese and English/i })
  const tip = page.locator('.toolbar-tip__tooltip:visible')

  await expect(page.locator('.vp-raw').first().locator('.ql-toolbar')).toBeVisible({ timeout: 30_000 })
  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(boldBtn).toBeVisible()

  await hoverUntilTipVisible(boldBtn, tip)
  await expect(tip).toHaveText('替换粗体文本')

  await switchBtn.click()
  await hoverUntilTipVisible(boldBtn, tip)
  await expect(tip).toHaveText('Replace bold text')
})

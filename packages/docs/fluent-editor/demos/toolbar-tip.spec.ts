import { type Locator, expect, test } from '@playwright/test'

async function hoverUntilTipVisible(button: Locator, tip: Locator) {
  await button.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'nearest' }))
  await expect(async () => {
    await button.hover()
    await expect(tip).toBeVisible({ timeout: 1_000 })
  }).toPass({ timeout: 15_000 })
}

test('has toolbar and shows tip on hover', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/toolbar-tip')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('.ql-editor').first()
  const boldBtn = toolbar.locator('.ql-bold')
  const tip = page.locator('.toolbar-tip__tooltip:visible')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(boldBtn).toBeVisible()

  await hoverUntilTipVisible(boldBtn, tip)
  await expect(tip).toContainText(/Bold|粗体/)
})

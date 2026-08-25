import { expect, test } from '@playwright/test'

test('inserts chemistry formula with mhchem', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/formula')

  const block = page.locator('.vp-raw').filter({ has: page.locator('#chemistry-editor') })
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = page.locator('#chemistry-editor .ql-editor')
  const formulaBtn = toolbar.locator('.ql-formula')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(formulaBtn).toBeVisible()

  await editor.click()
  await formulaBtn.click()
  const input = page.locator('.ql-tooltip[data-mode="formula"] input[data-formula]')
  await expect(input).toBeVisible()
  await input.fill('\\ce{H2O}')
  await input.blur()
  await expect(editor.locator('.katex')).toBeVisible()
})

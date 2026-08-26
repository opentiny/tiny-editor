import { expect, test } from '@playwright/test'

test('inserts katex formula from toolbar', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/formula')

  const block = page.locator('.vp-raw').first()
  const editor = page.locator('#editor .ql-editor')
  const formulaBtn = block.locator('.ql-formula')

  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(formulaBtn).toBeVisible()

  await editor.click()
  await formulaBtn.click()
  const input = page.locator('.ql-tooltip[data-mode="formula"] input[data-formula]')
  await expect(input).toBeVisible()
  await input.fill('e=mc^2')
  await input.blur()
  await expect(editor.locator('.katex')).toBeVisible()
})

import { expect, test } from '@playwright/test'

test('renders mathlive formulas and has formula button', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/formula')

  const block = page.locator('.vp-raw').filter({ has: page.locator('#mathliveEditor') })
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = page.locator('#mathliveEditor .ql-editor')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(editor.locator('math-field.ql-math-field').first()).toBeVisible()
  await expect(editor).toContainText('正弦交流电')
  await expect(toolbar.locator('.ql-formula')).toBeVisible()
})

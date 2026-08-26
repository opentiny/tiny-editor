import { expect, test } from '@playwright/test'

test('switches counter language between English and Chinese', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/i18n')

  const block = page.locator('.vp-raw').first()
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const counter = block.locator('.ql-counter').first()
  const switchBtn = block.getByRole('button', { name: /switch between Chinese and English/i })

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(counter).toBeVisible()
  await expect(counter).toHaveText('0/500 characters')

  await switchBtn.click()
  await expect(counter).toHaveText('0/500')
})

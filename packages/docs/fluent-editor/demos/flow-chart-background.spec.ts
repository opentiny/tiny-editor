import { expect, test } from '@playwright/test'

test('renders flow chart background demo with initial nodes', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/flow-chart')

  const block = page.locator('.vp-raw').nth(2)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const chart = editor.locator('.ql-flow-chart-item')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(toolbar.locator('.ql-flow-chart')).toBeVisible()
  await expect(chart).toBeVisible({ timeout: 30_000 })
  await expect(editor.locator('.lf-node')).toHaveCount(2)
  await expect(editor.locator('.lf-edge')).toHaveCount(1)
})

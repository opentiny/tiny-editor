import { expect, test } from '@playwright/test'

test('renders flow chart with resize handles', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/flow-chart')

  const block = page.locator('.vp-raw').nth(3)
  const toolbar = block.locator('.ql-toolbar').first()
  const editor = block.locator('.ql-editor').first()
  const chart = editor.locator('.ql-flow-chart-item')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(toolbar.locator('.ql-flow-chart')).toBeVisible()
  await expect(chart).toBeVisible({ timeout: 30_000 })
  await expect(chart.locator('.ql-flow-chart-resize-handle')).toHaveCount(4)
})

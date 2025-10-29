import { expect, test } from '@playwright/test'

test.describe('FlowChart.vue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/tiny-editor/docs/demo/flow-chart')
  })

  test('should render the editor', async ({ page }) => {
    const container = page.locator('.ql-container').first()
    const editor = container.locator('.ql-editor')
    await expect(editor).toBeVisible()
  })

  test('should have flow-chart button in toolbar', async ({ page }) => {
    const container = page.locator('.ql-container').first()
    const toolbar = container.locator('.ql-toolbar')
    await expect(toolbar).toBeVisible()
    await expect(toolbar.locator('.ql-flow-chart')).toBeVisible()
  })

  test('should initialize editor with flow chart content', async ({ page }) => {
    const container = page.locator('.ql-container').first()
    const editor = container.locator('.ql-editor')
    await expect(editor).toBeVisible()
    await expect(container.locator('.ql-flow-chart-item').first()).toBeVisible()
  })

  test('should contain initial flow chart nodes and edges', async ({ page }) => {
    const container = page.locator('.ql-container').first()
    const flowChart = container.locator('.ql-flow-chart-item').first()
    await expect(flowChart).toBeVisible()
    await expect(flowChart.locator('.lf-node')).toHaveCount(2, { timeout: 5000 })
    await expect(flowChart.locator('.lf-edge')).toHaveCount(1, { timeout: 5000 })
  })

  test('should activate flow-chart when button is clicked', async ({ page }) => {
    const container = page.locator('.ql-container').first()
    const flowChartButton = container.locator('.ql-toolbar .ql-flow-chart')
    await expect(flowChartButton).toBeVisible()
    await flowChartButton.click()
    await expect(container.locator('.ql-editor')).toBeVisible()
  })
})

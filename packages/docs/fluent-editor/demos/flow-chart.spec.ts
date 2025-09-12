import { expect, test } from '@playwright/test'

test.describe('FlowChart.vue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/tiny-editor/docs/demo/flow-chart')
  })

  test('should render the editor', async ({ page }) => {
    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()
  })

  test('should have flow-chart button in toolbar', async ({ page }) => {
    const toolbar = page.locator('.ql-toolbar')
    await expect(toolbar).toBeVisible()

    const flowChartButton = toolbar.locator('.ql-flow-chart')
    await expect(flowChartButton).toBeVisible()
  })

  test('should initialize editor with flow chart content', async ({ page }) => {
    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()

    await page.waitForTimeout(1000)

    const flowChartElement = editor.locator('.ql-flow-chart-item')
    await expect(flowChartElement).toBeVisible()
  })

  test('should contain initial flow chart nodes and edges', async ({ page }) => {
    await page.waitForTimeout(2000)

    const flowChartContainer = page.locator('.ql-flow-chart-item')
    await expect(flowChartContainer).toBeVisible()

    const nodes = page.locator('.lf-node')
    await expect(nodes).toHaveCount(2)

    const edges = page.locator('.lf-edge')
    await expect(edges).toHaveCount(1)
  })

  test('should activate flow-chart when button is clicked', async ({ page }) => {
    const flowChartButton = page.locator('.ql-toolbar .ql-flow-chart')
    await expect(flowChartButton).toBeVisible()

    await flowChartButton.click()

    await page.waitForTimeout(500)

    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()
  })
})

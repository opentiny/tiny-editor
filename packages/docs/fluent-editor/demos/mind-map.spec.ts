import { expect, test } from '@playwright/test'

test.describe('MindMap.vue', () => {
  test.beforeEach(async ({ page }) => {
    // 根据实际的路由调整这个URL
    await page.goto('http://localhost:5173/tiny-editor/docs/demo/mind-map')
  })

  test('should render the editor', async ({ page }) => {
    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()
  })

  test('should have mind-map button in toolbar', async ({ page }) => {
    const toolbar = page.locator('.ql-toolbar')
    await expect(toolbar).toBeVisible()

    const mindMapButton = toolbar.locator('.ql-mind-map')
    await expect(mindMapButton).toBeVisible()
  })

  test('should initialize editor with mind map content', async ({ page }) => {
    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()

    await page.waitForTimeout(1000)

    const mindMapElement = page.locator('.ql-mind-map-item')
    await expect(mindMapElement).toBeVisible()
  })

  test('should activate mind-map when button is clicked', async ({ page }) => {
    const mindMapButton = page.locator('.ql-toolbar .ql-mind-map')
    await expect(mindMapButton).toBeVisible()

    await mindMapButton.click()

    await page.waitForTimeout(500)

    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()
  })
})

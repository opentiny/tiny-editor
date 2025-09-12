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

    // 等待思维导图渲染完成
    await page.waitForTimeout(1000)

    // 检查是否存在思维导图相关元素
    const mindMapElement = page.locator('.ql-mind-map-item')
    await expect(mindMapElement).toBeVisible()
  })

  test('should activate mind-map when button is clicked', async ({ page }) => {
    const mindMapButton = page.locator('.ql-toolbar .ql-mind-map')
    await expect(mindMapButton).toBeVisible()

    // 点击mind-map按钮
    await mindMapButton.click()

    // 等待可能的弹窗或交互元素出现
    await page.waitForTimeout(500)

    // 验证点击按钮后编辑器仍然可见
    const editor = page.locator('.ql-editor')
    await expect(editor).toBeVisible()
  })
})

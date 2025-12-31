import { expect, test } from '@playwright/test'

test.describe('AddToolbarItem.vue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/tiny-editor/docs/demo/add-toolbar-item')
  })

  test('should render the editor', async ({ page }) => {
    const editor = page.locator('#editor-add-toolbar-item')
    expect(editor).not.toBeNull()
  })

  test('should initialize the editor with custom toolbar items', async ({ page }) => {
    const toolbar = page.locator('.ql-toolbar')
    expect(toolbar).not.toBeNull()
    const goodButton = toolbar.locator('.ql-good')
    const badButton = toolbar.locator('.ql-bad')
    expect(goodButton).not.toBeNull()
    expect(badButton).not.toBeNull()
  })

  test('should apply custom formats when toolbar buttons are clicked', async ({ page }) => {
    const editor = page.locator('#editor-add-toolbar-item .ql-editor')
    expect(editor).not.toBeNull()
    await editor.click()
    await page.keyboard.type('Test text')

    const goodButton = page.locator('.ql-good')
    expect(goodButton).not.toBeNull()
    await goodButton.click()
    await page.keyboard.type(' Good')

    const badButton = page.locator('.ql-bad')
    expect(badButton).not.toBeNull()
    await badButton.click()
    await page.keyboard.type(' Bad')

    const editorHtml = await editor.innerHTML()
    expect(editorHtml).toContain('<span style="color: rgb(92, 179, 0);"> Good</span>')
    expect(editorHtml).toContain('<span style="color: rgb(242, 48, 48);"> Bad</span>')
  })

  // 添加更多测试用例
})

import { expect, test } from '@playwright/test'

test('has toolbar, code-block button and golang language option', async ({ page }) => {
  await page.goto('/tiny-editor/docs/demo/code-block-highlight')

  const toolbar = page.locator('.ql-toolbar').first()
  const editor = page.locator('#editor .ql-editor')
  const codeBlockBtn = toolbar.locator('.ql-code-block')

  await expect(toolbar).toBeVisible({ timeout: 30_000 })
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await expect(codeBlockBtn).toBeVisible()

  await editor.click()
  await codeBlockBtn.click()

  const codeBlock = editor.locator('.ql-code-block-container').first()
  await expect(codeBlock).toBeVisible()
  await expect(codeBlock.locator('option[value="go"]')).toHaveText('Golang')

  await editor.locator('.ql-code-block').first().click()
  await page.keyboard.type('func main() {}')
  await expect(editor.locator('.ql-code-block').first()).toContainText('func main() {}')
})

import { type Browser, chromium, expect, firefox, type Page, test } from '@playwright/test'

const DEMO_URL = 'http://localhost:5173/tiny-editor/docs/demo/collaborative-editing'

test.describe.configure({ mode: 'serial' })

async function openTwoPages(): Promise<[Page, Page, Browser, Browser]> {
  const browser1 = await chromium.launch()
  const browser2 = await firefox.launch()

  const page1 = await browser1.newPage()
  const page2 = await browser2.newPage()

  await Promise.all([
    page1.goto(DEMO_URL),
    page2.goto(DEMO_URL),
  ])
  const editor1 = page1.locator('.ql-editor')
  const editor2 = page2.locator('.ql-editor')
  await expect(editor1).toBeVisible()
  await expect(editor2).toBeVisible()
  return [page1, page2, browser1, browser2]
}

async function typeSync(page1: Page, page2: Page, text: string): Promise<void> {
  await page1.locator('.ql-editor').click()
  await page1.keyboard.type(text)
  await expect.poll(async () => (await page2.locator('.ql-editor').textContent() || '').includes(text)).toBeTruthy()
}

async function selectAll(page: Page): Promise<void> {
  await page.locator('.ql-editor').press('ControlOrMeta+a')
}

let p1: Page, p2: Page, b1: Browser, b2: Browser

test.beforeEach(async () => {
  [p1, p2, b1, b2] = await openTwoPages()
})

test.afterEach(async () => {
  for (const page of [p1, p2]) {
    if (!page) continue
    const editor = page.locator('.ql-editor')
    if (await editor.count()) {
      await editor.first().click({ timeout: 2000 }).catch(() => {})
      await selectAll(page)
      await page.keyboard.press('Delete').catch(() => {})
    }
  }
  await Promise.all([
    b1?.close().catch(() => {}),
    b2?.close().catch(() => {}),
  ])
})

test('startup collaborative-editing test', async () => {
  await expect(p1.locator('.ql-editor')).toBeVisible()
  await expect(p2.locator('.ql-editor')).toBeVisible()
})

test('undo collaborative-editing test', async () => {
  await typeSync(p1, p2, 'ABC')
  await p1.getByLabel('undo').click()
  await expect.poll(async () => (await p2.locator('.ql-editor').textContent() || '').includes('ABC')).toBeFalsy()
})

test('redo collaborative-editing test', async () => {
  await typeSync(p1, p2, 'ABC')
  await p1.getByLabel('undo').click()
  await p1.getByLabel('redo').click()
  await expect.poll(async () => (await p2.locator('.ql-editor').textContent() || '').includes('ABC')).toBeTruthy()
})

test('clean collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Bold')
  await selectAll(p1)
  await p1.getByLabel('bold').click()
  await expect.poll(async () => (await p2.locator('.ql-editor').innerHTML()).includes('<strong>Bold</strong>')).toBeTruthy()
  await p1.getByLabel('clean').click()
  await expect.poll(async () => (await p2.locator('.ql-editor').innerHTML()).includes('<strong>Bold</strong>')).toBeFalsy()
})

// <hN> 或带 .ql-header-N 的段落
async function headingMatched(page: Page, level: number, text: string): Promise<boolean> {
  const editor = page.locator('.ql-editor')
  if (await editor.locator(`h${level}:has-text("${text}")`).count() > 0) return true
  if (await editor.locator(`.ql-header-${level}:has-text("${text}")`).count() > 0) return true
  return false
}

test('header collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Title')
  const levels = [1, 2, 3, 4, 5, 6]
  for (const lv of levels) {
    await p1.locator('.ql-editor').click()
    await selectAll(p1)
    if (lv <= 2) {
      await p1.getByRole('button', { name: 'Normal' }).click()
      await p1.getByRole('button', { name: `Heading ${lv}` }).click()
    }
    else {
      await p1.getByRole('button', { name: `Heading ${lv - 1}` }).click()
      await p1.getByRole('button', { name: `Heading ${lv}` }).click()
    }
    await expect.poll(() => headingMatched(p2, lv, 'Title')).toBeTruthy()
  }
})

test('size collaborative-editing test', async () => {
  await typeSync(p1, p2, 'HEAD')
  await p1.locator('.ql-editor').click()
  await selectAll(p1)

  const sequence = ['12px', '14px', '14px', '16px', '16px', '18px', '18px', '20px', '20px', '24px', '24px', '32px']

  let current = sequence[0]

  for (let i = 1; i < sequence.length; i++) {
    const next = sequence[i]
    if (next === current) {
      continue
    }
    await p1.getByRole('button', { name: current }).click()
    await p1.getByRole('button', { name: next }).click()

    const sizeMatch = next.match(/\d+px/)
    if (!sizeMatch) continue
    const size = sizeMatch[0]
    if (size === '12px') {
      await expect.poll(async () => {
        const hasParagraph = await p2.locator('.ql-editor p:has-text("HEAD")').count()
        const hasSpan = await p2.locator('.ql-editor span[style*="font-size"]').count()
        return hasParagraph > 0 && hasSpan === 0
      }).toBeTruthy()
    }
    else {
      await expect.poll(async () => (await p2.locator(`.ql-editor span[style*="font-size: ${size}"]`).count()) > 0).toBeTruthy()
    }
    current = next
  }
})

test('font collaborative-editing test', async () => {
  await typeSync(p1, p2, 'font')
  await p1.locator('.ql-editor').click()
  await selectAll(p1)

  await p1.getByRole('button', { name: 'Sans Serif' }).click()
  await p1.getByRole('button', { name: 'serif', exact: true }).click()

  await expect
    .poll(async () => (await p2.locator('.ql-editor span[style*="font-family: serif"]').count()) > 0)
    .toBeTruthy()
})

test('line-height collaborative-editing test', async () => {
  await typeSync(p1, p2, 'fdsafdsa')
  await p1.getByRole('button', { name: '1', exact: true }).click()
  await p1.getByRole('button', { name: '1.15' }).click()
  await expect.poll(async () => (await p2.locator('.ql-editor p[style*="line-height: 1.15"]').count()) > 0).toBeTruthy()
})

const formatTypes = ['bold', 'italic', 'underline', 'strike']
formatTypes.forEach((fmt) => {
  test(`${fmt} collaborative-editing test`, async () => {
    await typeSync(p1, p2, fmt)
    await selectAll(p1)
    await p1.getByLabel(fmt).click()
    const tagMap: Record<string, string> = { bold: 'strong', italic: 'em', underline: 'u', strike: '.ql-custom-strike' }
    const tag = tagMap[fmt]
    await expect.poll(async () => (await p2.locator(`.ql-editor ${tag}`).count()) > 0).toBeTruthy()
  })
})
test('code collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Colorful')
  await selectAll(p1)
  await p1.getByLabel('code', { exact: true }).click()
  await expect.poll(async () => (await p2.locator('.ql-editor p code').count()) > 0).toBeTruthy()
})
test('background collaborative-editing test', async () => {
  await typeSync(p1, p2, 'BG')
  await selectAll(p1)
  await p1.locator('.ql-background > .ql-picker-expand').click()
  await p1.getByRole('button', { name: 'rgb(229, 239, 255)' }).click()
  await expect.poll(async () => (await p2.locator('.ql-editor p span[style*="background-color: rgb(229, 239, 255)"]').count()) > 0).toBeTruthy()
})

test('align collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Align')
  await selectAll(p1)
  await p1.locator('.ql-align > .ql-picker-label').click()
  await p1.locator('#ql-picker-options-6').getByRole('button').nth(1).click()

  await expect.poll(async () => (await p2.locator('.ql-editor p[class="ql-align-center"]').count()) > 0).toBeTruthy()
})

test('list ordered collaborative-editing test', async () => {
  await typeSync(p1, p2, '1')
  await p1.getByLabel('ordered').click({ force: true })
  await expect.poll(async () => (await p2.locator('.ql-editor ol li').count()) > 0).toBeTruthy()
})

test('list bullet collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Item')
  await p1.getByLabel('bullet').click({ force: true })
  await expect.poll(async () => (await p2.locator('.ql-editor li[data-list="bullet"]').count()) > 0).toBeTruthy()
})

test('list check collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Check')
  await p1.getByLabel('check').click({ force: true })
  await expect.poll(async () => (await p2.locator('.ql-editor ol li[data-list="unchecked"]').count()) > 0).toBeTruthy()
})

test('indent increase collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Indent')
  await p1.getByLabel('+1').click({ force: true })
  await expect.poll(async () => (await p2.locator('.ql-editor p[class*="indent-"]').count()) > 0).toBeTruthy()
})

test('indent decrease collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Indent')
  await p1.getByLabel('+1').click({ force: true })
  await p1.getByLabel('-1').click({ force: true })
  await expect.poll(async () => (await p2.locator('.ql-editor p[class*="indent-"]').count()) === 0).toBeTruthy()
})

test('script sub collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Sub')
  await selectAll(p1)
  await p1.getByLabel('sub').click()
  await expect.poll(async () => (await p2.locator('.ql-editor sub').count()) > 0).toBeTruthy()
})

test('script super collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Super')
  await selectAll(p1)
  await p1.getByLabel('super').click()
  await expect.poll(async () => (await p2.locator('.ql-editor sup').count()) > 0).toBeTruthy()
})

test('link collaborative-editing test', async () => {
  const text = 'Link'
  await typeSync(p1, p2, text)
  await selectAll(p1)
  await p1.getByLabel('link', { exact: true }).click()
  const promptInput = p1.locator('input[type="text"]:visible')
  if (await promptInput.first().isVisible()) {
    await promptInput.first().fill(DEMO_URL)
    await promptInput.first().press('Enter')
  }
  await expect.poll(async () => (await p2.locator(`.ql-editor p a[href="${DEMO_URL}"]`).count()) > 0).toBeTruthy()
})

test('blockquote collaborative-editing test', async () => {
  await typeSync(p1, p2, 'Quote')
  await selectAll(p1)
  await p1.getByLabel('blockquote').click()
  await expect.poll(async () => (await p2.locator('.ql-editor blockquote').count()) > 0).toBeTruthy()
})

test('code-block collaborative-editing test', async () => {
  await typeSync(p1, p2, 'console.log(1)')
  await selectAll(p1)
  await p1.getByLabel('code-block').click()
  await expect.poll(async () => (await p2.locator('.ql-editor div.ql-code-block-container div.ql-code-block').count()) > 0).toBeTruthy()
})

test('divider collaborative-editing test', async () => {
  await p1.getByLabel('divider').click()
  await expect.poll(async () => (await p2.locator('.ql-editor hr').count()) > 0).toBeTruthy()
})

test('emoji collaborative-editing test', async () => {
  await p1.getByLabel('emoji').click()
  await p1.locator('div').filter({ hasText: /^👍😀😘😍😆😜😅😂$/ }).getByLabel('😘').click()
  await expect.poll(async () => (await p2.locator('.ql-editor').textContent() || '').includes('😘')).toBeTruthy()
})

test('formula collaborative-editing test', async () => {
  await p1.getByLabel('formula').click()
  await p1.locator('.ql-tooltip[data-mode="formula"] input[data-formula]').fill('e=mc^2')
  await p1.keyboard.press('Enter')
  await expect.poll(async () => (await p2.locator('.ql-editor .katex').count()) > 0).toBeTruthy()
})

test('table-up collaborative-editing test', async () => {
  await p1.locator('.ql-table-up > .ql-picker-label').click()
  await p1.locator('div:nth-child(29)').first().click()
  await expect.poll(async () => (await p2.locator('.ql-editor div.ql-table-wrapper').count()) > 0).toBeTruthy()
})

test('fullscreen collaborative-editing test', async () => {
  await p1.getByLabel('fullscreen').click({ force: true })
  await expect(p1.getByLabel('fullscreen')).toBeVisible()
})

test('edit conflict simultaneously test', async () => {
  await Promise.all([
    p1.locator('.ql-editor').click(),
    p2.locator('.ql-editor').click(),
  ])
  await Promise.all([
    p1.keyboard.type('A'),
    p2.keyboard.type('B'),
  ])
  await expect.poll(async () => {
    const text1 = await p1.locator('.ql-editor').textContent()
    const text2 = await p2.locator('.ql-editor').textContent()
    if (text1 === text2 && (text1 === 'AB' || text1 === 'BA')) {
      return true
    }
    return false
  }).toBeTruthy()
})

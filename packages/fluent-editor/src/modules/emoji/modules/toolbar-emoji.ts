import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../../../core/fluent-editor'
import Quill from 'quill'
import emojiList from '../emoji-list'
import { EMOJI_SPRITE as emojiSprite } from '../emoji-sprite'

export class ToolbarEmoji {
  toolbar: TypeToolbar
  constructor(public quill: FluentEditor) {
    this.quill = quill
    this.toolbar = quill.getModule('toolbar') as TypeToolbar
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('emoji', this.checkPalatteExist)
    }

    // 在emoji模块加载时判断并插入emoji精灵图样式，防止重复插入
    let emojiStyle = document.querySelector('style#devui-emoji-sprite')
    if (!emojiStyle) {
      emojiStyle = document.createElement('style')
      emojiStyle.setAttribute('id', 'devui-emoji-sprite')
      emojiStyle.innerHTML = `.ap{background-image:url(${emojiSprite})}`
      document.head.appendChild(emojiStyle)
    }
  }

  checkPalatteExist() {
    const quill = this.quill
    fnCheckDialogOpen(quill)
    this.quill.on('text-change', (_delta, _oldDelta, source) => {
      if (source === 'user') {
        fnClose()
        fnUpdateRange(quill)
      }
    })
  }
}

function fnClose() {
  const eleEmojiPlate = document.getElementById('emoji-palette')
  document.getElementById('emoji-close-div').style.display = 'none'
  if (eleEmojiPlate) {
    eleEmojiPlate.remove()
  }
}

function fnCheckDialogOpen(quill) {
  const elementExists = document.getElementById('emoji-palette')
  if (elementExists) {
    elementExists.remove()
  }
  else {
    fnShowEmojiPalatte(quill)
  }
}

function fnUpdateRange(quill) {
  const range = quill.getSelection()
  return range
}

function fnShowEmojiPalatte(quill) {
  const eleEmojiArea = document.createElement('div')
  const range = quill.getSelection()
  const atSignBounds = quill.getBounds(range.index)

  quill.container.appendChild(eleEmojiArea)
  const containerRect = quill.container.getBoundingClientRect()
  const paletteMaxPos = atSignBounds.left + 250 // palette max width is 250
  eleEmojiArea.id = 'emoji-palette'
  eleEmojiArea.style.top = `${10 + atSignBounds.top + atSignBounds.height + containerRect.top}px`
  if (paletteMaxPos > quill.container.offsetWidth) {
    eleEmojiArea.style.left = `${atSignBounds.left + containerRect.left - 250}px`
  }
  else {
    eleEmojiArea.style.left = `${atSignBounds.left + containerRect.left}px`
  }

  const tabToolbar = document.createElement('div')
  tabToolbar.id = 'tab-toolbar'
  eleEmojiArea.appendChild(tabToolbar)

  // panel
  const panel = document.createElement('div')
  panel.id = 'tab-panel'
  eleEmojiArea.appendChild(panel)

  const emojiType = [
    { type: 'p', name: 'people', content: '<div class="i-people"></div>' },
    { type: 'n', name: 'nature', content: '<div class="i-nature"></div>' },
    { type: 'd', name: 'food', content: '<div class="i-food"></div>' },
    { type: 's', name: 'symbols', content: '<div class="i-symbols"></div>' },
    { type: 'a', name: 'activity', content: '<div class="i-activity"></div>' },
    { type: 't', name: 'travel', content: '<div class="i-travel"></div>' },
    { type: 'o', name: 'objects', content: '<div class="i-objects"></div>' },
    { type: 'f', name: 'flags', content: '<div class="i-flags"></div>' },
  ]

  const tabElementHolder = document.createElement('ul')
  tabToolbar.appendChild(tabElementHolder)

  if (document.getElementById('emoji-close-div') === null) {
    const closeDiv = document.createElement('div')
    closeDiv.id = 'emoji-close-div'
    closeDiv.addEventListener('click', fnClose, false)
    document.getElementsByTagName('body')[0].appendChild(closeDiv)
  }
  else {
    document.getElementById('emoji-close-div').style.display = 'block'
  }

  emojiType.forEach((emojiTypeItem) => {
    // add tab bar
    const tabElement = document.createElement('li')
    tabElement.classList.add('emoji-tab')
    tabElement.classList.add(`filter-${emojiTypeItem.name}`)
    const tabValue = emojiTypeItem.content
    tabElement.innerHTML = tabValue
    tabElement.dataset.filter = emojiTypeItem.type
    tabElementHolder.appendChild(tabElement)

    const emojiFilter = document.querySelector(`.filter-${emojiTypeItem.name}`)
    emojiFilter.addEventListener('click', () => {
      const tab = document.querySelector('.emoji-tab.active')
      if (tab) {
        tab.classList.remove('active')
      }
      emojiFilter.classList.toggle('active')
      fnUpdateEmojiContainer(emojiFilter, panel, quill)
    })
  })
  fnEmojiPanelInit(panel, quill)
}

function fnEmojiPanelInit(panel, quill) {
  fnEmojiElementsToPanel('p', panel, quill)
  document.querySelector('.filter-people').classList.add('active')
}

function fnEmojiElementsToPanel(_type, panel, quill) {
  const result = emojiList
  result.sort((a: any, b: any) => {
    return a.emoji_order - b.emoji_order
  })

  quill.focus()
  const range = fnUpdateRange(quill)

  result.forEach((emoji: any) => {
    const span = document.createElement('span')
    const t = document.createTextNode(emoji.shortname)
    span.appendChild(t)
    span.classList.add('bem')
    span.classList.add(`bem-${emoji.name}`)
    span.classList.add('ap')
    span.classList.add(`ap-${emoji.name}`)
    const output = String(String(emoji.code_decimal))
    span.innerHTML = `${output} `
    panel.appendChild(span)

    const customButton = document.querySelector(`.bem-${emoji.name}`)
    if (customButton) {
      customButton.addEventListener('click', () => {
        quill.insertEmbed(range.index, 'emoji', emoji, Quill.sources.USER)
        setTimeout(() => quill.setSelection(range.index + 1), 0)
        fnClose()
      })
    }
  })
}

function fnUpdateEmojiContainer(emojiFilter, panel, quill) {
  while (panel.firstChild) {
    panel.removeChild(panel.firstChild)
  }
  const type = emojiFilter.dataset.filter
  fnEmojiElementsToPanel(type, panel, quill)
}

import type Quill from 'quill'
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

export interface EmojiModulePLusOptions {
  theme?: string
  locale?: string
  set?: string
  skinTonePosition?: string
  previewPosition?: string
  searchPosition?: string
  categories?: string[]
  maxFrequentRows?: number
  perLine?: number
  navPosition?: string
  noCountryFlags?: boolean
  dynamicWidth?: boolean
}

const DefaultOptions: EmojiModulePLusOptions = {
  theme: 'light',
  locale: 'zh',
  set: 'native',
  skinTonePosition: 'none',
  previewPosition: 'bottom',
  searchPosition: 'sticky',
  categories: ['frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags'],
  maxFrequentRows: 2,
  perLine: 8,
  navPosition: 'top',
  noCountryFlags: false,
  dynamicWidth: false,
}

class EmojiPlusModule {
  private quill: Quill
  private options: EmojiModulePLusOptions
  private picker: HTMLElement | null
  private isPickerVisible: boolean

  constructor(quill: Quill, options: EmojiModulePLusOptions = {}) {
    this.quill = quill
    this.options = { ...DefaultOptions, ...options }
    this.picker = null
    this.isPickerVisible = false

    const but = this.getButton()

    but.addEventListener('click', () => {
      if (this.isPickerVisible) {
        this.closeDialog()
      }
      else {
        this.openDialog()
      }
    })
  }

  private getButton() {
    return document.getElementsByClassName('ql-emoji-plus')[0]
  }

  public openDialog() {
    if (!this.picker) {
      this.picker = new Picker({
        data,
        onEmojiSelect: (emoji: any) => this.selectEmoji(emoji),
        onClickOutside: (event: MouseEvent) => this.onClickOutside(event),
        ...this.options,
      }) as unknown as HTMLElement

      document.body.appendChild(this.picker)

      const rect = this.getButton()?.getBoundingClientRect()
      if (rect) {
        this.picker.style.top = `${rect.top + 25}px`
        this.picker.style.left = `${rect.left}px`
      }

      this.picker.style.boxShadow = '0 4px 4px 0 rgba(0, 0, 0, 0.25)'
      this.picker.style.position = 'absolute'
      this.picker.style.zIndex = '1'

      this.isPickerVisible = true
    }
  }

  public closeDialog() {
    this.isPickerVisible = false
    this.picker?.remove()
    this.picker = null
  }

  private selectEmoji(emoji: any) {
    const emojiDelta = this.quill.insertText(
      this.quill.getSelection(true).index,
      emoji.native,
      'user',
    )

    this.closeDialog()

    // 设置表情符号后的输入位置
    setTimeout(() => {
      this.quill.setSelection(this.quill.getSelection(true).index + emojiDelta.length())
    })
  }

  private onClickOutside(event: MouseEvent): void {
    const but = this.getButton()

    // 仅当工具栏内的表情符号按钮存在且未发生点击时才关闭！
    if (!but || !(but === event.target || (event.target instanceof Element && but.contains(event.target)))) {
      this.closeDialog()
    }
  }

  public destroy() {
    this.closeDialog()
  }
}

export {
  EmojiPlusModule,
}

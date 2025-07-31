import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../../core/fluent-editor'
import {
  ADJUST_ICON,
  AI_ICON,
  CALL_ICON,
  CLOSE_ICON,
  COPY_ICON,
  EDITOR_ICON,
  INSERT_ICON,
  MENU_CLOSE_ICON,
  REBUILD_ICON,
  REFRESH_ICON,
  REPLACE_SELECT_ICON,
  RIGHT_ARROW_ICON,
  SEND_BTN_ICON,
  STOP_ICON,
  THINK_ICON,
  SHARE_ICON,
  VOICE_ICON
} from './icons'
import {
  INPUT_PLACEHOLDER,
  SELECT_PLACEHOLDER,
  STOP_ANSWER,
  REPLACE_SELECT,
  INSERT_TEXT,
  INSERT_SUB_CONTENT_TEXT,
  REGENERATE,
  CLOSE,
  THINK_TEXT,
  RESULT_HEADER_TEXT,
  MENU_TITLE_DATA,
  MENU_ID_MAP
} from './constants'
import type { ResultMenuItem, OperationMenuItem, AIOptions } from './types'

export class AI {
  toolbar: TypeToolbar
  host: string
  apiKey: string
  model: string
  message: string
  isBreak: boolean = false // 打断标记
  textNumber: number // 文本字数限制
  private _isSelectRangeMode: boolean = false // 选择/点击模式
  private _charCount: number = 0 // 文本字数
  private _debounceTimer = null
  private _inputPlaceholder: string = ''
  private _showOperationMenu: boolean = false
  private _isThinking: boolean = false // 思考中
  private _showResultPopupEl: boolean = false // 结果弹窗
  selectedText: string = '' // 选择的文本
  inputValue: string = '' // 存储输入框的值
  resultMenuList: ResultMenuItem[] = []
  operationMenuList: OperationMenuItem[] = []
  private _operationMenuItemList: OperationMenuItem[] = []

  private alertEl: HTMLDivElement | null = null
  private alertTimer: number | null = null
  private selectionBubbleEl: HTMLDivElement | null = null
  private selectionRange: any = null
  private dialogContainerEl: HTMLDivElement | null = null
  private wrapContainerEl: HTMLDivElement | null = null
  private aiIconEl: HTMLSpanElement | null = null
  private inputContainerEl: HTMLDivElement | null = null
  private inputEl: HTMLInputElement | null = null
  private menuContainerEl: HTMLDivElement | null = null
  private subMenuEl: HTMLDivElement | null = null
  private subMenuEditorEl: HTMLDivElement | null = null
  private subMenuToneEl: HTMLDivElement | null = null
  private subMenuAdjustEl: HTMLDivElement | null = null
  private inputRightEl: HTMLDivElement | null = null
  private inputSendBtnEl: HTMLSpanElement | null = null
  private inputCloseBtnEl: HTMLSpanElement | null = null
  private thinkContainerEl: HTMLDivElement | null = null // 思考元素
  private thinkBtnEl: HTMLDivElement | null = null
  private resultPopupEl: HTMLDivElement | null = null
  private resultPopupHeaderEl: HTMLDivElement | null = null
  private resultPopupContentEl: HTMLDivElement | null = null
  private resultPopupFooterEl: HTMLDivElement | null = null
  private resultPopupFooterTextEl: HTMLSpanElement | null = null
  private resultRefreshBtnEl: HTMLSpanElement | null = null
  private resultCopyBtnEl: HTMLSpanElement | null = null
  // 分享和朗读功能待放开
  // private resultShareBtnEl: HTMLSpanElement | null = null
  // private resultVoiceBtnEl: HTMLSpanElement | null = null
  private actionMenuEl: HTMLDivElement | null = null

  constructor(
    public quill: FluentEditor,
    public options: AIOptions
  ) {
    this.quill = quill
    this.toolbar = quill.getModule('toolbar') as TypeToolbar
    // 添加AI按钮到工具栏
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('ai', this.showAIInput.bind(this))
    }

    this.quill.on('selection-change', this.handleSelectionChange.bind(this))

    this.host = options.host || 'https://api.deepseek.com/v1'
    this.apiKey = options.apiKey
    this.model = options.model || 'deepseek-chat'
    this.textNumber = options.contentMaxLength || 5000

    this.resultMenuList = [
      { text: REPLACE_SELECT, icon: REPLACE_SELECT_ICON },
      { text: INSERT_TEXT, icon: INSERT_ICON, selectText: INSERT_SUB_CONTENT_TEXT },
      { text: REGENERATE, icon: REBUILD_ICON },
      { text: CLOSE, icon: MENU_CLOSE_ICON }
    ]

    this.operationMenuList = [
      { id: 'editor', text: '编辑调整内容', icon: EDITOR_ICON },
      { id: 'tone', text: '改写口吻', icon: CALL_ICON },
      { id: 'adjust', text: '整理选区内容', icon: ADJUST_ICON }
    ]
  }

  // 工具栏启动
  showAIInput() {
    // 创建输入框和结果弹窗
    this.create()

    this.selectionRange = this.quill.getSelection()
    if (this.selectionRange.length) {
      this.isSelectRangeMode = true
    } else {
      this.isSelectRangeMode = false
    }
    // 定位到编辑器焦点位置
    this.positionElements()

    // 添加ESC键监听
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeAIPanel()
        this.quill.container.removeEventListener('keydown', handleKeyDown)
      }
    }
    this.quill.container.addEventListener('keydown', handleKeyDown)
  }

  // 气泡启动
  private selectTextEvent() {
    if (!this.selectionRange) return
    this.create()
    // 定位到编辑器焦点位置
    this.positionElements()

    this.isSelectRangeMode = true
  }

  private create() {
    this.createResultElement()
    this.createOperationMenuElements()
    this.createInputBoxElements()

    // 创建事件监听
    this.addInputEvent()
    this.addResultEvent()
    this.handleActionMenuDisplay()
    // 添加到编辑器
    this.quill.container.appendChild(this.dialogContainerEl)
  }

  // 创建结果弹窗
  private createResultElement() {
    if (!this.resultPopupEl) {
      this.resultPopupEl = document.createElement('div')
      this.resultPopupEl.className = 'ql-ai-result'
      this.resultPopupHeaderEl = document.createElement('div')
      this.resultPopupHeaderEl.className = 'ql-ai-result-header'
      this.resultPopupHeaderEl.innerText = RESULT_HEADER_TEXT
      this.resultPopupContentEl = document.createElement('div')
      this.resultPopupContentEl.className = 'ql-ai-result-content'
      this.resultPopupFooterEl = document.createElement('div')
      this.resultPopupFooterEl.className = 'ql-ai-result-footer'
      this.resultPopupFooterTextEl = document.createElement('span')
      this.resultPopupFooterTextEl.className = 'ql-ai-result-footer-text'
      this.resultPopupFooterTextEl.innerText = `0`
      this.resultRefreshBtnEl = document.createElement('span')
      this.resultRefreshBtnEl.className = 'ql-ai-result-footer-refresh'
      this.resultRefreshBtnEl.innerHTML = REFRESH_ICON
      this.resultCopyBtnEl = document.createElement('span')
      this.resultCopyBtnEl.className = 'ql-ai-result-footer-copy'
      this.resultCopyBtnEl.innerHTML = COPY_ICON

      // 分享和朗读功能待放开
      // this.resultShareBtnEl = document.createElement('span')
      // this.resultShareBtnEl.className = 'ql-ai-result-footer-share'
      // this.resultShareBtnEl.innerHTML = SHARE_ICON
      // this.resultVoiceBtnEl = document.createElement('span')
      // this.resultVoiceBtnEl.className = 'ql-ai-result-footer-voice'
      // this.resultVoiceBtnEl.innerHTML = VOICE_ICON
      const resultFooterRightEl: HTMLDivElement = document.createElement('div')
      resultFooterRightEl.appendChild(this.resultRefreshBtnEl)
      resultFooterRightEl.appendChild(this.resultCopyBtnEl)
      // 分享和朗读功能待放开
      // resultFooterRightEl.appendChild(this.resultShareBtnEl)
      // resultFooterRightEl.appendChild(this.resultVoiceBtnEl)
      this.resultPopupFooterEl.appendChild(this.resultPopupFooterTextEl)
      this.resultPopupFooterEl.appendChild(resultFooterRightEl)
      this.resultPopupEl.appendChild(this.resultPopupHeaderEl)
      this.resultPopupEl.appendChild(this.resultPopupContentEl)
      this.resultPopupEl.appendChild(this.resultPopupFooterEl)
    }
    this.showResultPopupEl = false
  }

  private createOperationMenuElements() {
    if (!this.menuContainerEl) {
      // 创建操作菜单容器
      this.menuContainerEl = document.createElement('div')
      this.menuContainerEl.className = 'ql-ai-menu-container'

      // 创建主菜单
      const mainMenu = document.createElement('div')
      mainMenu.className = 'ql-ai-main-menu'
      this.operationMenuList.forEach(({ text, icon, id }) => {
        const menuItem = document.createElement('div')
        menuItem.className = 'ql-ai-menu-item'
        menuItem.innerHTML = `${icon}<span>${text}</span>${RIGHT_ARROW_ICON}`
        menuItem.addEventListener('mouseenter', (e) => {
          e.stopPropagation()
          this.subMenuEl.style.display = 'block'
          this.subMenuEl.className = `ql-ai-sub-menu ${id}`
          this.createOperationMenuItem(id)
        })
        mainMenu.appendChild(menuItem)
      })
      if (!this.subMenuEl) {
        // 创建子菜单
        this.subMenuEl = document.createElement('div')
        this.subMenuEl.className = 'ql-ai-sub-menu'
        this.subMenuEl.style.display = 'none'
      }

      this.menuContainerEl.appendChild(mainMenu)
      this.menuContainerEl.appendChild(this.subMenuEl)
    }
    this.showOperationMenu = false
  }

  private createOperationMenuItem(id: string) {
    let menuItemBox = this[MENU_ID_MAP[id]]
    if (!menuItemBox) {
      menuItemBox = document.createElement('div')
    }
    // 清除子菜单容器中的所有子元素
    while (this.subMenuEl.firstChild) {
      this.subMenuEl.removeChild(this.subMenuEl.firstChild)
    }

    MENU_TITLE_DATA[id].forEach(({ text, icon, id }) => {
      const menuItem = document.createElement('div')
      menuItem.className = 'ql-ai-menu-item'
      menuItem.innerHTML = `${icon || ''}<span>${text}</span>`
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation()
        this.handleOperationMenuItemClick(text, id)
      })
      menuItemBox.appendChild(menuItem)
    })
    this.subMenuEl.appendChild(menuItemBox)
  }

  private createInputBoxElements() {
    if (!this.dialogContainerEl) {
      this.dialogContainerEl = document.createElement('div')
      this.dialogContainerEl.className = 'ql-ai-dialog'
      this.wrapContainerEl = document.createElement('div')
      this.wrapContainerEl.className = 'ql-ai-wrapper'
      this.wrapContainerEl.style.width = `${this.quill.container.clientWidth - 30}px`

      // 添加AI图标
      this.createAIInputIcon()

      // 增加输入框
      this.inputEl = document.createElement('input')
      this.inputEl.type = 'text'
      this.inputPlaceholder = this._isSelectRangeMode ? SELECT_PLACEHOLDER : INPUT_PLACEHOLDER
      // 添加发送按钮
      this.inputSendBtnEl = document.createElement('span')
      this.inputSendBtnEl.className = 'ql-ai-input-right-send'
      this.inputSendBtnEl.innerHTML = SEND_BTN_ICON
      this.inputCloseBtnEl = document.createElement('span')
      this.inputCloseBtnEl.className = 'ql-ai-input-right-close'
      this.inputCloseBtnEl.innerHTML = CLOSE_ICON
      this.inputRightEl = document.createElement('div')
      this.inputRightEl.className = 'ql-ai-input-right'

      // 创建输入框
      this.inputContainerEl = document.createElement('div')
      this.inputContainerEl.className = 'ql-ai-input'
      this.inputContainerEl.appendChild(this.aiIconEl)
      this.inputContainerEl.appendChild(this.inputEl)
      this.inputRightEl.appendChild(this.inputSendBtnEl)
      this.inputRightEl.appendChild(this.inputCloseBtnEl)
      this.inputContainerEl.appendChild(this.inputRightEl) // 添加发送按钮
      this.wrapContainerEl.appendChild(this.resultPopupEl)
      this.wrapContainerEl.appendChild(this.inputContainerEl)
      this.wrapContainerEl.appendChild(this.menuContainerEl) // 添加菜单容器
      this.dialogContainerEl.appendChild(this.wrapContainerEl)
    } else {
      this.dialogContainerEl.style.display = 'block'
    }
    this.hiddenInputSendBtnEl()
  }

  private hiddenInputSendBtnEl(display = 'none') {
    if (this.inputEl && this.inputSendBtnEl) {
      this.inputSendBtnEl.style.display = display
    }
  }

  private copyResult() {
    if (!this.resultPopupContentEl) return

    try {
      const textToCopy = this.resultPopupContentEl.textContent || ''
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          this.showAlert('内容已复制到剪贴板')
          // 可以在这里添加复制成功的提示
        })
        .catch((err) => {
          this.showAlert(`复制失败:${err}`)
        })
    } catch (err) {
      this.showAlert(`复制失败:${err}`)
      // 兼容不支持clipboard API的浏览器
      const textarea = document.createElement('textarea')
      textarea.value = this.resultPopupContentEl.textContent || ''
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  // 分享和朗读功能待放开
  // private shareResult() {
  //   if (!this.resultPopupContentEl) return

  //   const textToShare = this.resultPopupContentEl.textContent || ''
  //   const title = 'AI生成内容分享'

  //   if (navigator.share) {
  //     navigator.share({
  //       title,
  //       text: textToShare,
  //     })
  //       .catch((err) => {
  //         this.showAlert(`分享失败:${err}`)
  //       })
  //   }
  //   else {
  //     // 兼容不支持Web Share API的浏览器
  //     const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(textToShare)}`
  //     window.open(shareUrl, '_blank')
  //   }
  // }
  // private voiceResult() {
  //   if (!this.resultPopupContentEl) return

  //   const textToSpeak = this.resultPopupContentEl.textContent || ''

  //   if ('speechSynthesis' in window) {
  //     const utterance = new SpeechSynthesisUtterance(textToSpeak)
  //     utterance.lang = 'zh-CN' // 设置中文语音
  //     speechSynthesis.speak(utterance)
  //   }
  //   else {
  //     this.showAlert('当前浏览器不支持语音合成API')
  //     // 可以在这里添加不支持语音的提示
  //   }
  // }

  private addResultEvent() {
    if (this.resultRefreshBtnEl) {
      this.resultRefreshBtnEl.addEventListener('click', () => {
        this.regenerateResponse()
      })
    }

    if (this.resultCopyBtnEl) {
      this.resultCopyBtnEl.addEventListener('click', () => {
        this.copyResult()
      })
    }

    // 分享和朗读功能待放开
    // if (this.resultShareBtnEl) {
    //   this.resultShareBtnEl.addEventListener('click', () => {
    //     this.shareResult()
    //   })
    // }
    // if (this.resultVoiceBtnEl) {
    //   this.resultVoiceBtnEl.addEventListener('click', () => {
    //     this.voiceResult()
    //   })
    // }
  }

  // 显示选中文本的气泡
  private showSelectionBubble() {
    if (!this.selectionBubbleEl) {
      this.selectionBubbleEl = document.createElement('div')
      this.selectionBubbleEl.className = 'ql-ai-selection-bubble'
      const icon = AI_ICON.replaceAll('paint_linear_2', 'paint_linear_bubble')
      this.selectionBubbleEl.innerHTML = `${icon}<span>AI 智能</span>`
      this.selectionBubbleEl.addEventListener('click', () => this.selectTextEvent())
      document.body.appendChild(this.selectionBubbleEl)
    }

    const { left, top } = this.quill.getBounds(this.selectionRange.index)
    const { left: endLeft } = this.quill.getBounds(this.selectionRange.index + this.selectionRange.length)
    const width = (endLeft - left) / 2
    const editorRect = this.quill.container.getBoundingClientRect()

    this.selectionBubbleEl.style.display = 'flex'
    this.selectionBubbleEl.style.left = `${left + editorRect.left + width - 45}px`
    this.selectionBubbleEl.style.top = `${top + editorRect.top - 40}px`
  }

  // 隐藏选中文本的气泡
  private hideSelectionBubble() {
    if (this.selectionBubbleEl) {
      this.selectionBubbleEl.style.display = 'none'
    }
  }

  // 处理文本选中变化
  private handleSelectionChange(range: any) {
    if (range && range.length > 0) {
      this.selectionRange = range
      this.showSelectionBubble()
      this.selectedText = this.quill.getText(range.index, range.length)
    } else {
      if (range && range.index !== null) {
        this.selectedText = ''
        this.closeAIPanel()
      } else {
        this.hideSelectionBubble()
      }
    }
  }

  private addInputEvent() {
    if (this.inputContainerEl) {
      this.inputContainerEl.addEventListener('click', () => {})
    }

    // 监听输入事件
    if (this.inputEl) {
      this.inputEl.addEventListener('input', () => {
        this.hiddenInputSendBtnEl(this.inputEl.value.trim() ? 'flex' : 'none')
        if (this.menuContainerEl && this._isSelectRangeMode) {
          this.showOperationMenu = !this.inputEl.value.trim() && !this._showResultPopupEl
        }
      })
    }

    // 给发送按钮添加点击事件
    if (this.inputSendBtnEl) {
      this.inputSendBtnEl.addEventListener('click', async () => {
        await this.queryAI()
      })
    }
    // 监听发送事件
    this.inputEl.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        await this.queryAI()
      }
    })

    // 给关闭按钮添加点击事件
    if (this.inputCloseBtnEl) {
      this.inputCloseBtnEl.addEventListener('click', () => {
        this.closeAIPanel()
      })
    }
  }

  private positionElements() {
    if (!this.dialogContainerEl) return
    const range = this.selectionRange
    if (range) {
      const bounds = this.quill.getBounds(range.index)
      this.dialogContainerEl.style.position = 'absolute'
      this.dialogContainerEl.style.top = `${bounds.top + bounds.height + 20}px`
    }
  }

  // 添加创建alert元素的方法
  private createAlertElement() {
    if (!this.alertEl) {
      this.alertEl = document.createElement('div')
      this.alertEl.className = 'ql-ai-alert'
      this.alertEl.style.display = 'none'
      document.body.appendChild(this.alertEl)
    }
  }

  // 添加显示alert的方法
  private showAlert(message: string, duration: number = 3000) {
    this.createAlertElement()
    if (!this.alertEl) return

    // 清除之前的定时器
    if (this.alertTimer) {
      clearTimeout(this.alertTimer)
      this.alertTimer = null
    }

    this.alertEl.textContent = message
    this.alertEl.style.display = 'block'

    // 自动隐藏
    this.alertTimer = setTimeout(() => {
      if (this.alertEl) {
        this.alertEl.style.display = 'none'
      }
      this.alertTimer = null
    }, duration) as unknown as number
  }

  private createAIInputIcon() {
    if (!this.aiIconEl) {
      this.aiIconEl = document.createElement('span')
      this.aiIconEl.className = 'ql-ai-input-pre-icon'
      const icon = AI_ICON.replaceAll('paint_linear_2', 'paint_linear_ai_input')
      this.aiIconEl.innerHTML = icon
    }
  }

  // 添加处理子菜单点击的方法
  private handleOperationMenuItemClick(text: string, id: string = '') {
    let quetion = ''
    if (id.startsWith('1-') || id.startsWith('3-')) {
      quetion = `将目标文字${text}，目标文字为：${this.selectedText}`
    } else if (id.startsWith('2-')) {
      quetion = `改写目标文字的口吻，让其变得${text}，目标文字为：${this.selectedText}`
    }
    this.showOperationMenu = false
    this.queryAI(quetion)
  }

  private createActionMenu() {
    if (!this.actionMenuEl) {
      this.actionMenuEl = document.createElement('div')
      this.actionMenuEl.className = 'ql-ai-actions'

      this.resultMenuList.forEach(({ text, icon }) => {
        const menuItem = document.createElement('div')
        menuItem.className = 'ql-ai-action-item'
        menuItem.innerHTML = `${icon}<span class="ql-ai-result-menu-text">${text}</span>`
        menuItem.addEventListener('click', () => this.handleAction(text))
        this.actionMenuEl.appendChild(menuItem)
      })

      this.wrapContainerEl.appendChild(this.actionMenuEl)
    }
    const secondMenuItemText = this.actionMenuEl.children[1].querySelector('.ql-ai-result-menu-text') as HTMLDivElement
    if (!this._isSelectRangeMode) {
      this.actionMenuEl.firstChild.classList.add('hidden')
      secondMenuItemText.textContent = INSERT_TEXT
    } else {
      this.actionMenuEl.firstChild.classList.remove('hidden')
      secondMenuItemText.textContent = INSERT_SUB_CONTENT_TEXT
    }

    this.isThinking = false
  }

  private handleActionMenuDisplay(value: string = 'none') {
    if (this.actionMenuEl) {
      this.actionMenuEl.style.display = value
    }
  }

  private switchInputEl(showInput = true) {
    if (this.inputContainerEl) {
      this.inputContainerEl.style.display = showInput ? 'flex' : 'none'
    }

    this.handleActionMenuDisplay(showInput ? 'block' : 'none')

    if (this.thinkContainerEl) {
      this.thinkContainerEl.style.display = showInput ? 'none' : 'flex'
    }
  }

  // 创建思考元素
  private createThinkElements() {
    if (!this.thinkContainerEl) {
      this.thinkContainerEl = document.createElement('div')
      this.thinkContainerEl.className = 'ql-ai-input'
      this.thinkContainerEl.innerHTML = `<span class="ql-ai-input-pre-icon ql-ai-think-icon">${THINK_ICON}</span><span class="ql-ai-think-text">${THINK_TEXT}</span>`
      this.thinkBtnEl = document.createElement('div')
      this.thinkBtnEl.className = 'ql-ai-think-btn'
      this.thinkBtnEl.innerHTML = `${STOP_ICON}<span>${STOP_ANSWER}</span>`
      this.thinkContainerEl.appendChild(this.thinkBtnEl)
      this.wrapContainerEl.appendChild(this.thinkContainerEl) // 添加发送按钮
      this.thinkBtnEl.addEventListener('click', () => {
        this.isBreak = true
        this.isThinking = false
      })
    }

    this.isThinking = true
  }

  // AI查询
  private async queryAI(question?: string): Promise<string> {
    this.createThinkElements()
    this.inputValue = question || this.inputEl.value
    if (this.inputValue.trim() === '') {
      return
    }

    // 有信息
    this.isBreak = false // 重置打断标记，防止重复打断ai
    // 这里实现实际的AI查询逻辑
    try {
      const response = await fetch(`${this.host}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          prompt: this.inputValue,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let content = ''

      while (true) {
        if (this.isBreak) {
          this.isBreak = false
          break
        }

        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            content += data.response || ''
            this.showAIResponse(content)
          } catch (e) {
            console.error('解析错误:', e)
          }
        }
      }

      // 创建操作菜单
      this.createActionMenu()
      this.inputEl.value = '' // 清空输入框
      this.hiddenInputSendBtnEl()
      return content
    } catch (error) {
      console.error('AI查询失败:', error)
      return 'AI查询失败，请重试'
    }
  }

  private showAIResponse(response: string) {
    if (!this.resultPopupEl) return

    // 显示结果
    if (this._charCount <= this.textNumber) {
      this.resultPopupContentEl.innerHTML = response
      this.charCount = this.resultPopupContentEl.textContent.replace(/\s+/g, '').length
    } else {
      this.isBreak = true
    }
    this.showResultPopupEl = true
  }

  private handleAction(action: string) {
    switch (action) {
      case REPLACE_SELECT:
        this.replaceSelectText()
        break
      case INSERT_TEXT:
        this.insertAIResponse()
        break
      case REGENERATE:
        this.regenerateResponse()
        break
      case CLOSE:
        this.closeAIPanel()
        break
    }
  }

  private replaceSelectText() {
    if (!this.resultPopupContentEl) return
    const range = this.quill.getSelection(true)
    if (range && range.length > 0) {
      // 删除选中内容
      this.quill.deleteText(range.index, range.length)
      // 插入AI生成的内容
      this.quill.clipboard.dangerouslyPasteHTML(range.index, this.resultPopupContentEl.innerHTML)
    }
    this.closeAIPanel()
  }

  private insertAIResponse() {
    if (!this.resultPopupContentEl) return
    const range = this.quill.getSelection(true)
    if (range) {
      this.quill.clipboard.dangerouslyPasteHTML(range.index + range.length, this.resultPopupContentEl.innerHTML)
    }
    this.closeAIPanel()
  }

  private async regenerateResponse() {
    await this.queryAI(this.inputValue)
  }

  private closeAIPanel() {
    this.isBreak = true // 停止查询

    if (this.dialogContainerEl) {
      this.dialogContainerEl.style.display = 'none'
    }

    if (this.actionMenuEl) {
      this.actionMenuEl.style.display = 'none'
    }

    this.showResultPopupEl = false

    if (this.inputEl && this.inputEl.value.trim() !== '') {
      this.inputEl.value = '' // 清空输入框
    }
    this.hideSelectionBubble()
  }

  set charCount(value: number) {
    // 清除之前的定时器
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer)
    }

    this._debounceTimer = setTimeout(() => {
      this._charCount = value
      if (this.resultPopupFooterTextEl) {
        this.resultPopupFooterTextEl.innerText = `${this._charCount}/${this.textNumber}`
      }
      clearTimeout(this._debounceTimer)
      this._debounceTimer = null
    }, 210)
  }

  set inputPlaceholder(value: string) {
    this._inputPlaceholder = value
    if (this.inputEl) {
      this.inputEl.placeholder = value
    }
  }

  set showOperationMenu(value: boolean) {
    this._showOperationMenu = value
    if (this.menuContainerEl) {
      this.menuContainerEl.style.display = value ? 'flex' : 'none'
    }
  }

  set isSelectRangeMode(value: boolean) {
    this._isSelectRangeMode = value
    this.showOperationMenu = value
    this.inputPlaceholder = value ? SELECT_PLACEHOLDER : INPUT_PLACEHOLDER
    this.hideSelectionBubble()
  }

  set isThinking(value: boolean) {
    this._isThinking = value
    this.switchInputEl(!value)
  }

  set showResultPopupEl(value: boolean) {
    this._showResultPopupEl = value
    if (this.resultPopupEl) {
      this.resultPopupEl.style.display = value ? 'block' : 'none'
    }
  }
}

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
  RICH_CONTENT_ICON,
  RIGHT_ARROW_ICON,
  SEND_BTN_ICON,
  SHARE_ICON,
  STOP_ICON,
  STREAMLINE_CONTENT_ICON,
  SYMBOL_ICON,
  THINK_ICON,
  TRANSLATE_ICON,
  VOICE_ICON,
} from './icons'

const INPUT_PLACEHOLDER = '请输入问题或“/”获取提示词'
const SELECT_PLACEHOLDER = '向我提问/选择操作'
const STOP_ANSWER = '停止回答'
const INSERT_TEXT = '插入内容'
const REGENERATE = '重新生成'
const CLOSE = '关闭'
const THINK_TEXT = '正在为您分析并总结答案'
const RESULT_HEADER_TEXT = '根据您的诉求，已为您解答，具体如下：'

export class AI {
  toolbar: TypeToolbar
  host: string
  apiKey: string
  model: string
  message: string
  isBreak: boolean = false // 打断标记
  private _isSelectRangeMode: boolean = false // 选择/点击模式
  private _charCount: number = 0 // 文本字数
  private _debounceTimer = null
  private _inputPlaceholder: string = ''
  private _showOperationMenu: boolean = false
  inputValue: string = '' // 存储输入框的值
  resultMenuList: { text: string, icon: string }[] = []
  operationMenuList: { id: string, text: string, icon: string, rightIcon?: string }[] = []
  operationMenuItemList: { id: string, text: string, icon: string }[] = []

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

  constructor(public quill: FluentEditor, public options: any) {
    this.quill = quill
    this.toolbar = quill.getModule('toolbar') as TypeToolbar
    // 添加AI按钮到工具栏
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('ai', this.showAIInput.bind(this))
    }

    this.quill.on('selection-change', this.handleSelectionChange.bind(this))

    this.host = options.host
    this.apiKey = options.apiKey
    this.model = options.model

    this.resultMenuList = [
      { text: INSERT_TEXT, icon: INSERT_ICON },
      { text: REGENERATE, icon: REBUILD_ICON },
      { text: CLOSE, icon: MENU_CLOSE_ICON },
    ]

    this.operationMenuList = [
      { id: '1', text: '编辑调整内容', icon: EDITOR_ICON, rightIcon: RIGHT_ARROW_ICON },
      { id: '2', text: '改写口吻', icon: CALL_ICON },
      { id: '3', text: '整理选区内容', icon: ADJUST_ICON },
    ]

    this.operationMenuItemList = [
      { id: '1-1', text: '丰富内容', icon: RICH_CONTENT_ICON },
      { id: '1-2', text: '精简内容', icon: STREAMLINE_CONTENT_ICON },
      { id: '1-3', text: '修改标点符号', icon: SYMBOL_ICON },
      { id: '1-4', text: '翻译', icon: TRANSLATE_ICON },
    ]
  }

  // 工具栏启动
  showAIInput() {
    // 创建输入框和结果弹窗
    this.create()

    // 定位到编辑器焦点位置
    this.positionElements()
    const range = this.quill.getSelection()
    if (range.length) {
      this.isSelectRangeMode = true
    }
    else {
      this.isSelectRangeMode = false
    }

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
    this.isSelectRangeMode = true

    // const selectedText = this.quill.getText(this.selectionRange.index, this.selectionRange.length)
    // this.inputEl.value = `处理这段文字: ${selectedText}`
    // this.inputEl.focus()
    // this.hideSelectionBubble()
  }

  private create() {
    this.createResultElement()
    this.createOperationMenuElements()
    this.createInputBoxElements()

    // 创建事件监听
    this.addInputEvent()
    this.addResultEvent()
    // 添加到编辑器
    this.quill.container.appendChild(this.dialogContainerEl)
  }

  // 创建结果弹窗
  private createResultElement() {
    if (!this.resultPopupEl) {
      this.resultPopupEl = document.createElement('div')
      this.resultPopupEl.className = 'ql-ai-result'
      this.resultPopupEl.style.display = 'none'
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
  }

  private createOperationMenuElements() {
    if (!this.menuContainerEl) {
      // 创建操作菜单容器
      this.menuContainerEl = document.createElement('div')
      this.menuContainerEl.className = 'ql-ai-menu-container'

      // 创建主菜单
      const mainMenu = document.createElement('div')
      mainMenu.className = 'ql-ai-main-menu'
      this.operationMenuList.forEach(({ text, icon, rightIcon, id }) => {
        const menuItem = document.createElement('div')
        menuItem.className = 'ql-ai-menu-item'
        menuItem.innerHTML = `${icon}<span>${text}</span>${rightIcon || ''}`
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation()
          if (text === '编辑调整内容') {
            subMenu.style.display = 'block'
          }
          else {
            subMenu.style.display = 'none'
            this.handleOperationMenuClick(id)
          }
        })
        mainMenu.appendChild(menuItem)
      })

      // 创建子菜单
      const subMenu = document.createElement('div')
      subMenu.className = 'ql-ai-sub-menu'
      subMenu.style.display = 'none'
      this.operationMenuItemList.forEach(({ text, icon, id }) => {
        const menuItem = document.createElement('div')
        menuItem.className = 'ql-ai-menu-item'
        menuItem.innerHTML = `${icon}<span>${text}</span>`
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation()
          this.handleOperationMenuItemClick(id)
        })
        subMenu.appendChild(menuItem)
      })

      this.menuContainerEl.appendChild(mainMenu)
      this.menuContainerEl.appendChild(subMenu)
    }
    this.showOperationMenu = false
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
      this.inputSendBtnEl.style.display = 'none'
      this.inputContainerEl.appendChild(this.inputRightEl) // 添加发送按钮
      this.wrapContainerEl.appendChild(this.inputContainerEl)
      this.wrapContainerEl.appendChild(this.menuContainerEl) // 添加菜单容器
      this.wrapContainerEl.appendChild(this.resultPopupEl)
      this.dialogContainerEl.appendChild(this.wrapContainerEl)
    }
    else {
      this.dialogContainerEl.style.display = 'block'
    }
  }

  private copyResult() {
    if (!this.resultPopupContentEl) return

    try {
      const textToCopy = this.resultPopupContentEl.textContent || ''
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.showAlert('内容已复制到剪贴板')
          // 可以在这里添加复制成功的提示
        })
        .catch((err) => {
          this.showAlert(`复制失败:${err}`)
        })
    }
    catch (err) {
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
    }
    else {
      this.hideSelectionBubble()
      if (range && range.index !== null) {
        this.closeAIPanel()
      }
    }
  }

  private addInputEvent() {
    if (this.inputContainerEl) {
      this.inputContainerEl.addEventListener('click', () => {
      })
    }

    // 监听输入事件
    if (this.inputEl) {
      this.inputEl.addEventListener('input', () => {
        if (this.inputEl && this.inputSendBtnEl) {
          this.inputSendBtnEl.style.display = this.inputEl.value.trim() ? 'flex' : 'none'
        }
        if (this.menuContainerEl && this._isSelectRangeMode) {
          this.showOperationMenu = !this.inputEl.value.trim()
        }
      })
    }

    // 给发送按钮添加点击事件
    if (this.inputSendBtnEl) {
      this.inputSendBtnEl.addEventListener('click', async () => {
        this.switchInputEl(false)
        await this.queryAI()
        this.switchInputEl()
      })
    }
    // 监听发送事件
    this.inputEl.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        await this.queryAI()
        this.switchInputEl()
      }
    })

    // 给关闭按钮添加点击事件
    if (this.inputCloseBtnEl) {
      this.inputCloseBtnEl.addEventListener('click', () => {
        this.closeAIPanel()
      })
    }
  }

  positionElements() {
    if (!this.dialogContainerEl) return
    const range = this.quill.getSelection()
    if (range) {
      const bounds = this.quill.getBounds(range.index)
      this.dialogContainerEl.style.position = 'absolute'
      this.dialogContainerEl.style.top = `${bounds.top + bounds.height}px`
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

  // 添加处理主菜单点击的方法
  private handleOperationMenuClick(id: string) {
    if (id !== '1') {
      const content = JSON.stringify(this.quill.root.innerHTML)
      let quetion = ''
      if (id === '2') {
        quetion = `改写这块内容的叙述口吻，并保持原有的格式和语言风格,不要思考过程，直接返回修改后的内容，这块内容为：${content}`
      }
      else if (id === '3') {
        quetion = `整理这块内容的格式，使其更清晰、更易读，不要思考过程，直接返回修改后的内容，这块内容为：${content}`
      }
      this.showOperationMenu = false
      this.queryAI(quetion)
    }
  }

  // 添加处理子菜单点击的方法
  private handleOperationMenuItemClick(id: string) {
    const content = JSON.stringify(this.quill.root.innerHTML)
    let quetion = ''
    if (id === '1-1') {
      quetion = `丰富这块内容的内容，使其更丰富、更详细，不要思考过程，直接返回修改后的内容，这块内容为：${content}`
    }
    else if (id === '1-2') {
      quetion = `精简这块内容的内容，使其更简洁、更清晰，不要思考过程，直接返回修改后的内容，这块内容为：${content}`
    }
    else if (id === '1-3') {
      quetion = `修改这块内容的标点符号，使其更符合中文习惯，不要思考过程，直接返回修改后的内容，这块内容为：${content}`
    }
    else if (id === '1-4') {
      quetion = `将这块内容翻译成英文，不要思考过程，直接返回修改后的内容，这块内容为：${content}`
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
  }

  private switchInputEl(showInput = true) {
    if (this.inputContainerEl) {
      this.inputContainerEl.style.display = showInput ? 'flex' : 'none'
    }

    if (this.actionMenuEl) {
      this.actionMenuEl.style.display = showInput ? 'block' : 'none'
    }

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
      })
    }

    this.switchInputEl(false)
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
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          prompt: this.inputValue,
          stream: true,
        }),
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
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            content += data.response || ''
            this.showAIResponse(content)
          }
          catch (e) {
            console.error('解析错误:', e)
          }
        }
      }

      // 创建操作菜单
      this.createActionMenu()
      this.inputEl.value = '' // 清空输入框
      return content
    }
    catch (error) {
      console.error('AI查询失败:', error)
      return 'AI查询失败，请重试'
    }
  }

  private showAIResponse(response: string) {
    if (!this.resultPopupEl) return

    // 显示结果
    this.resultPopupContentEl.innerHTML = response
    this.charCount = this.resultPopupContentEl.textContent.replace(/\s+/g, '').length
    this.resultPopupEl.style.display = 'block'
  }

  private handleAction(action: string) {
    switch (action) {
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

  private insertAIResponse() {
    if (!this.resultPopupContentEl) return
    const range = this.quill.getSelection(true)
    if (range) {
      if (range.length > 0) {
        // 有选中文本，先删除选中内容
        this.quill.deleteText(range.index, range.length)
        // 然后插入AI生成的内容
        this.quill.clipboard.dangerouslyPasteHTML(
          range.index,
          this.resultPopupContentEl.innerHTML,
        )
      }
      else {
        this.quill.clipboard.dangerouslyPasteHTML(
          range.index,
          this.resultPopupContentEl.innerHTML,
        )
      }
    }
    this.closeAIPanel()
  }

  private async regenerateResponse() {
    this.switchInputEl(false)
    await this.queryAI(this.inputValue)
    this.switchInputEl()
  }

  private closeAIPanel() {
    this.isBreak = true // 停止查询

    if (this.dialogContainerEl) {
      this.dialogContainerEl.style.display = 'none'
    }

    if (this.actionMenuEl) {
      this.actionMenuEl.style.display = 'none'
    }

    if (this.resultPopupEl) {
      this.resultPopupEl.style.display = 'none'
    }

    if (this.inputEl && this.inputEl.value.trim() !== '') {
      this.inputEl.value = '' // 清空输入框
    }
  }

  set charCount(value: number) {
    // 清除之前的定时器
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer)
    }

    this._debounceTimer = setTimeout(() => {
      this._charCount = value
      if (this.resultPopupFooterTextEl) {
        this.resultPopupFooterTextEl.innerText = `${this._charCount}`
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
}

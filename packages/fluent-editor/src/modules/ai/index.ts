import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../../core/fluent-editor'
import { Ollama } from 'ollama'
import { AI_ICON } from '../../ui/icons.config'

export class AI {
  toolbar: TypeToolbar
  host: string
  apiKey: string
  model: string
  message: string
  isBreak: boolean = false // 打断标记
  inputValue: string = '' // 存储输入框的值
  private dialogContainer: HTMLDivElement | null = null
  private wrapContainer: HTMLDivElement | null = null
  private aiPreTextEl: HTMLSpanElement | null = null
  private inputContainer: HTMLDivElement | null = null
  private inputEl: HTMLTextAreaElement | null = null
  private sendButtonEl: HTMLDivElement | null = null
  private resultPopup: HTMLDivElement | null = null
  private actionMenu: HTMLDivElement | null = null

  constructor(public quill: FluentEditor, public options: any) {
    this.quill = quill
    this.toolbar = quill.getModule('toolbar') as TypeToolbar
    // 添加AI按钮到工具栏
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('ai', this.showAIInput.bind(this))
    }

    this.host = options.host
    this.apiKey = options.apiKey
    this.model = options.model
  }

  positionElements() {
    if (!this.dialogContainer) return
    const range = this.quill.getSelection()
    if (range) {
      const bounds = this.quill.getBounds(range.index)
      this.dialogContainer.style.position = 'absolute'
      this.dialogContainer.style.top = `${bounds.top + bounds.height}px`
    }
  }

  private operateSendButtonEl(text: string = '发送', isShow: boolean = true) {
    // 添加发送按钮
    if (!this.sendButtonEl) {
      this.sendButtonEl = document.createElement('div')
      this.sendButtonEl.className = 'ql-ai-send'
    }
    this.sendButtonEl.innerText = text
    this.sendButtonEl.style.display = isShow ? 'block' : 'none' // 显示发送按钮
  }

  // 创建AI提示语元素
  private createAiPreTextEl() {
    if (!this.aiPreTextEl) {
      this.aiPreTextEl = document.createElement('span')
      this.aiPreTextEl.className = 'ql-ai-tip'
    }
    this.aiPreTextEl.innerText = `${this.model}帮你写：`
  }

  showAIInput() {
    // 创建输入框和结果弹窗
    this.dialogContainer = document.createElement('div')
    this.dialogContainer.className = 'ql-ai-dialog'

    this.wrapContainer = document.createElement('div')
    this.wrapContainer.className = 'ql-ai-wrapper'
    this.wrapContainer.style.width = `${this.quill.container.clientWidth * 0.9}px`

    // 创建输入框
    this.inputContainer = document.createElement('div')
    this.inputContainer.className = 'ql-ai-input'

    // 添加AI图标
    const aiIcon = document.createElement('div')
    aiIcon.className = 'ql-ai-icon'
    aiIcon.innerHTML = AI_ICON

    // 添加AI提示语
    this.createAiPreTextEl()

    // 替换input为textarea
    this.inputEl = document.createElement('input')
    this.inputEl.type = 'text'
    this.inputEl.placeholder = '请输入内容'

    this.operateSendButtonEl()

    // 创建结果弹窗
    this.resultPopup = document.createElement('div')
    this.resultPopup.className = 'ql-ai-result'
    this.resultPopup.style.display = 'none'

    // 添加到编辑器
    this.wrapContainer.appendChild(this.resultPopup)
    this.inputContainer.appendChild(aiIcon)
    this.inputContainer.appendChild(this.aiPreTextEl)
    this.inputContainer.appendChild(this.inputEl)
    this.inputContainer.appendChild(this.sendButtonEl) // 添加发送按钮
    this.wrapContainer.appendChild(this.inputContainer)
    this.dialogContainer.appendChild(this.wrapContainer)
    this.quill.container.appendChild(this.dialogContainer)

    // 定位到编辑器焦点位置
    this.positionElements()

    // 监听输入事件
    this.inputEl.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        this.inputValue = this.inputEl.value
        this.inputEl.value = '' // 清空输入框
        await this.queryAI()
      }
    })
    this.sendButtonEl.addEventListener('click', async (e) => {
      if (e.target.innerText === '停止') {
        this.isBreak = true
      }
      else {
        this.inputValue = this.inputEl.value
        this.inputEl.value = '' // 清空输入框
        await this.queryAI()
      }
    })
  }

  private async queryAI(): Promise<string> {
    this.operateSendButtonEl('停止')
    this.aiPreTextEl.innerText = '正在编写...'
    this.inputEl.value = ''
    // 这里实现实际的AI查询逻辑
    try {
      console.log('this.inputValue', this.inputValue)
      const ollama = new Ollama({ host: this.host })
      const res = await ollama.generate({
        model: this.model,
        prompt: this.inputValue,
        stream: true,
      })
      let content = ''
      for await (const chunk of res) {
        if (this.isBreak) {
          this.isBreak = false
          break
        }
        content += chunk.response
        this.showAIResponse(content)
      }
      // 创建操作菜单
      this.createActionMenu()
      if (content) {
        this.aiPreTextEl.innerText = '' // 清空提示语
        this.operateSendButtonEl('发送', false) // 隐藏发送按钮
      }
    }
    catch (error) {
      console.error('AI查询失败:', error)
      return 'AI查询失败，请重试'
    }
  }

  private showAIResponse(response: string) {
    if (!this.resultPopup || !this.inputContainer) return

    // 显示结果
    this.resultPopup.innerHTML = response
    this.resultPopup.style.display = 'block'
  }

  private createActionMenu() {
    if (this.actionMenu) return

    this.actionMenu = document.createElement('div')
    this.actionMenu.className = 'ql-ai-actions'
    this.actionMenu.style.display = 'none' // 初始隐藏

    const actions = ['完成', '重新生成', '关闭']
    actions.forEach((action) => {
      const menuItem = document.createElement('div')
      menuItem.className = 'ql-ai-action-item'
      menuItem.textContent = action
      menuItem.addEventListener('click', () => this.handleAction(action))
      this.actionMenu?.appendChild(menuItem)
    })

    this.wrapContainer.appendChild(this.actionMenu)
    // 展示下拉菜单
    this.actionMenu!.style.display = 'block'
  }

  private handleAction(action: string) {
    switch (action) {
      case '完成':
        this.insertAIResponse()
        break
      case '重新生成':
        this.regenerateResponse()
        break
      case '关闭':
        this.closeAIPanel()
        break
    }
  }

  private insertAIResponse() {
    if (!this.resultPopup) return
    const range = this.quill.getSelection(true)
    if (range) {
      // 使用HTML方式插入可以保留格式
      this.quill.clipboard.dangerouslyPasteHTML(
        range.index,
        this.resultPopup.innerHTML,
      )
      // 将光标移动到插入内容的末尾
      this.quill.setSelection(
        range.index + this.resultPopup.innerHTML.length,
        0,
        'api',
      )
    }
    this.closeAIPanel()
  }

  private async regenerateResponse() {
    this.wrapContainer.removeChild(this.actionMenu)
    this.actionMenu = null
    if (this.inputValue) {
      this.inputEl.value = '' // 清空输入框
      await this.queryAI()
    }
  }

  private closeAIPanel() {
    if (this.dialogContainer) {
      this.quill.container.removeChild(this.dialogContainer)
      this.dialogContainer = null
      this.inputContainer = null
      this.resultPopup = null
      this.actionMenu = null
    }
  }
}

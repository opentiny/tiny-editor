import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../../core/fluent-editor'
import { AI_ICON } from '../../ui/icons.config'

export class AI {
  toolbar: TypeToolbar
  host: string
  apiKey: string
  model: string
  message: string
  isBreak: boolean = false // 打断标记
  inputValue: string = '' // 存储输入框的值
  SEND: string = '发送' // 发送按钮文字
  BREAK: string = '停止' // 取消按钮文字
  DONE: string = '完成'
  REGENERATE: string = '重新生成'
  CLOSE: string = '关闭'
  private dialogContainerEl: HTMLDivElement | null = null
  private wrapContainerEl: HTMLDivElement | null = null
  private aiPreTextEl: HTMLSpanElement | null = null
  private inputContainerEl: HTMLDivElement | null = null
  private inputEl: HTMLInputElement | null = null
  private sendButtonEl: HTMLDivElement | null = null
  private resultPopupEl: HTMLDivElement | null = null
  private actionMenuEl: HTMLDivElement | null = null

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
    if (!this.dialogContainerEl) return
    const range = this.quill.getSelection()
    if (range) {
      const bounds = this.quill.getBounds(range.index)
      this.dialogContainerEl.style.position = 'absolute'
      this.dialogContainerEl.style.top = `${bounds.top + bounds.height}px`
    }
  }

  // 创建AI提示语元素
  private createAiPreTextEl() {
    if (!this.aiPreTextEl) {
      this.aiPreTextEl = document.createElement('span')
      this.aiPreTextEl.className = 'ql-ai-tip'
    }
  }

  // 创建弹出框
  private createElements() {
    if (!this.dialogContainerEl) {
      this.dialogContainerEl = document.createElement('div')
      this.dialogContainerEl.className = 'ql-ai-dialog'
      this.wrapContainerEl = document.createElement('div')
      this.wrapContainerEl.className = 'ql-ai-wrapper'
      this.wrapContainerEl.style.width = `${this.quill.container.clientWidth * 0.9}px`

      // 创建输入框
      this.inputContainerEl = document.createElement('div')
      this.inputContainerEl.className = 'ql-ai-input'

      // 添加AI图标
      const aiIcon = document.createElement('div')
      aiIcon.className = 'ql-ai-icon'
      aiIcon.innerHTML = AI_ICON
      // 添加AI提示语
      this.createAiPreTextEl()

      // 增加输入框
      this.inputEl = document.createElement('input')
      this.inputEl.type = 'text'
      this.inputEl.placeholder = '请输入内容'
      // 添加发送按钮
      this.sendButtonEl = document.createElement('div')
      this.sendButtonEl.className = 'ql-ai-send'

      // 创建结果弹窗
      this.resultPopupEl = document.createElement('div')
      this.resultPopupEl.className = 'ql-ai-result'

      // 添加到编辑器
      this.wrapContainerEl.appendChild(this.resultPopupEl)
      this.inputContainerEl.appendChild(aiIcon)
      this.inputContainerEl.appendChild(this.aiPreTextEl)
      this.inputContainerEl.appendChild(this.inputEl)
      this.inputContainerEl.appendChild(this.sendButtonEl) // 添加发送按钮
      this.wrapContainerEl.appendChild(this.inputContainerEl)
      this.dialogContainerEl.appendChild(this.wrapContainerEl)
    }

    this.aiPreTextEl.textContent = `${this.model}帮你写：`
    this.sendButtonEl.textContent = this.SEND
    this.sendButtonEl.style.display = 'block' // 显示发送按钮
    this.resultPopupEl.style.display = 'none'
    this.quill.container.appendChild(this.dialogContainerEl)
  }

  showAIInput() {
    // 创建输入框和结果弹窗
    this.createElements()

    // 定位到编辑器焦点位置
    this.positionElements()

    // 监听发送事件
    this.inputEl.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        await this.queryAI()
      }
    })
    this.sendButtonEl.addEventListener('click', async (e) => {
      if (e.target instanceof HTMLElement && e.target.textContent === this.BREAK) {
        this.isBreak = true
      }
      else {
        await this.queryAI()
      }
    })

    // 添加ESC键监听
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeAIPanel()
        this.quill.container.removeEventListener('keydown', handleKeyDown)
      }
    }
    this.quill.container.addEventListener('keydown', handleKeyDown)
  }

  // AI查询
  private async queryAI(question?: string): Promise<string> {
    this.inputValue = question || this.inputEl.value
    this.inputEl.value = '' // 清空输入框
    if (this.inputValue.trim() === '') {
      return
    }

    // 有信息
    this.isBreak = false // 重置打断标记，防止重复打断ai
    this.sendButtonEl.textContent = this.BREAK
    this.sendButtonEl.style.display = 'block'
    this.aiPreTextEl.textContent = '按ESC退出 | 正在编写...' // 显示提示语
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
      if (content) {
        this.aiPreTextEl.textContent = '' // 清空提示语
        // 隐藏发送按钮
        this.sendButtonEl.textContent = this.SEND
        this.sendButtonEl.style.display = 'none'
      }
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
    this.resultPopupEl.innerHTML = response
    this.resultPopupEl.style.display = 'block'
  }

  private createActionMenu() {
    if (!this.actionMenuEl) {
      this.actionMenuEl = document.createElement('div')
      this.actionMenuEl.className = 'ql-ai-actions'

      const actions = [this.DONE, this.REGENERATE, this.CLOSE]
      actions.forEach((action) => {
        const menuItem = document.createElement('div')
        menuItem.className = 'ql-ai-action-item'
        menuItem.textContent = action
        menuItem.addEventListener('click', () => this.handleAction(action))
        this.actionMenuEl.appendChild(menuItem)
      })

      this.wrapContainerEl.appendChild(this.actionMenuEl)
    }
    // 展示下拉菜单
    this.actionMenuEl.style.display = 'block'
  }

  private handleAction(action: string) {
    switch (action) {
      case this.DONE:
        this.insertAIResponse()
        break
      case this.REGENERATE:
        this.regenerateResponse()
        break
      case this.CLOSE:
        this.closeAIPanel()
        break
    }
  }

  private insertAIResponse() {
    if (!this.resultPopupEl) return
    const range = this.quill.getSelection(true)
    if (range) {
      // 使用HTML方式插入可以保留格式
      this.quill.clipboard.dangerouslyPasteHTML(
        range.index,
        this.resultPopupEl.innerHTML,
      )
    }
    this.closeAIPanel()
  }

  private async regenerateResponse() {
    this.actionMenuEl.style.display = 'none'
    await this.queryAI(this.inputValue)
  }

  private closeAIPanel() {
    this.isBreak = true // 停止查询
    if (this.dialogContainerEl) {
      this.quill.container.removeChild(this.dialogContainerEl)
    }
    this.dialogContainerEl = null
    this.actionMenuEl = null
  }
}

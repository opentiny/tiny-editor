import type TypeSyntax from 'quill/modules/syntax'
import Quill from 'quill'

const Syntax = Quill.import('modules/syntax') as typeof TypeSyntax

// @dynamic
class CustomSyntax extends Syntax {
  static DEFAULTS: { hljs: any, interval: number, languages: { key: string, label: string }[] }

  private detectLanguage(text: string): string | null {
    const hljs = (this as any).options?.hljs
    if (!hljs || typeof hljs.highlightAuto !== 'function') {
      return null
    }
    // highlight.js 在 10/11 版本均支持 highlightAuto
    const result = hljs.highlightAuto(text, Object.keys((this as any).languages || {}))
    return result?.language || null
  }

  highlightBlot(text: string, language = 'plain') {
    if (!language || !(this as any).languages?.[language] || language === 'plain') {
      const detected = this.detectLanguage(text)
      if (detected) {
        language = detected
      }
    }
    // 调用基类逻辑执行真正的高亮
    return super.highlightBlot(text, language)
  }
}

CustomSyntax.DEFAULTS = {
  hljs: (() => {
    // @ts-ignore
    return window.hljs
  })(),
  interval: 1000,
  languages: [
    { key: 'plain', label: 'Plain' },
    { key: 'bash', label: 'Bash' },
    { key: 'cpp', label: 'C++' },
    { key: 'cs', label: 'C#' },
    { key: 'css', label: 'CSS' },
    { key: 'diff', label: 'Diff' },
    { key: 'xml', label: 'HTML/XML' },
    { key: 'java', label: 'Java' },
    { key: 'javascript', label: 'Javascript' },
    { key: 'markdown', label: 'Markdown' },
    { key: 'php', label: 'PHP' },
    { key: 'python', label: 'Python' },
    { key: 'ruby', label: 'Ruby' },
    { key: 'sql', label: 'SQL' },
  ],
}

export default CustomSyntax

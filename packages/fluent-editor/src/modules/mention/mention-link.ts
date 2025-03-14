import type TypeEmbed from 'quill/blots/embed'
import type TypeScroll from 'quill/blots/scroll'
import Quill from 'quill'
import { DEFAULT_MENTION_CHAR, MENTION_CHAR, ON_MENTION_LINK_REMOVE } from './constants'

const Embed = Quill.import('blots/embed') as typeof TypeEmbed

export class MentionLink extends Embed {
  static blotName: string
  static tagName: string
  static className: string
  mentionData: any

  static create(data) {
    let node: HTMLElement
    if (data.link) {
      node = document.createElement('a')
      node.setAttribute('href', data.link)
      node.setAttribute('target', data.target)
    }
    else {
      node = document.createElement(this.tagName)
    }
    node.classList.add(this.className)
    node.dataset.mentionId = data.name || (data.mention && data.mention[data.searchKey || 'name']) || ''
    node.setAttribute('title', data.text)
    node.setAttribute(MENTION_CHAR, data.char)
    node.textContent = data.char + data.text
    return node
  }

  static value(domNode: HTMLElement) {
    const value: Record<string, any> = {
      char: domNode.getAttribute(MENTION_CHAR) || DEFAULT_MENTION_CHAR,
      text: domNode.getAttribute('title'),
      name: domNode.dataset.mentionId,
    }
    if (domNode.tagName.toLowerCase() === 'a' && domNode.hasAttribute('href')) {
      value.link = domNode.getAttribute('href')
      value.target = domNode.getAttribute('target')
    }
    return value
  }

  constructor(public scroll: TypeScroll, domNode, data) {
    super(scroll, domNode)
    this.mentionData = data
  }

  value() {
    // fix: 将@提醒内容加入到 Delta 里，以解决输入空格，@提醒内容被删除的问题
    // return ' ';
    return super.value()
  }

  remove() {
    this.scroll.emitter.emit(ON_MENTION_LINK_REMOVE, this.mentionData)
    return super.remove()
  }
}

MentionLink.blotName = 'mention'
MentionLink.tagName = 'span'
MentionLink.className = 'ql-mention-link'

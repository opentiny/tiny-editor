import type TypeClipboard from 'quill/modules/clipboard'
import type FluentEditor from '../fluent-editor'
import Quill from 'quill'
import {
  ERROR_IMAGE_PLACEHOLDER_CN,
  ERROR_IMAGE_PLACEHOLDER_EN,
} from '../config/base64-image'
import { BIG_DELTA_LIMIT } from '../config/editor.config'
import {
  hexToRgbA,
  imageUrlToFile,
  isNullOrUndefined,
  replaceDeltaImage,
  replaceStrWhiteSpace,
  splitWithBreak,
} from '../config/editor.utils'
import {
  getClipboardImageFiles,
  getPasteImageSrc,
  isExcelHtml,
  isUsablePasteImageSrc,
  shouldUploadFilesOnly,
} from '../config/paste-image'
import { isString } from '../utils/is'

const Clipboard = Quill.import('modules/clipboard') as typeof TypeClipboard
const Delta = Quill.import('delta')

export class CustomClipboard extends Clipboard {
  declare quill: FluentEditor

  constructor(public quill: FluentEditor) {
    super(quill)
    // 解决 quill 组件在中文输入法的情景下开始输入placeholder不消失的问题
    this.quill.root.addEventListener('input', () => {
      if (this.quill.root.innerText !== '\\n' && this.quill.root.classList.contains('ql-blank')) {
        this.quill.root.classList.toggle('ql-blank', false)
      }
      else {
        this.quill.options.placeholder = this.quill.getLangText('editor-placeholder')
      }
    })
  }

  prepareMatching(container: HTMLElement, nodeMatches) {
    const elementMatchers = []
    const textMatchers = []
    this.matchers.forEach((pair) => {
      const [selector, matcher] = pair
      if (selector === Node.TEXT_NODE) {
        textMatchers.push(matcher)
      }
      else if (selector === Node.ELEMENT_NODE) {
        elementMatchers.push(matcher)
      }
      else if (isString(selector)) {
        // word 的 v:shape 系列标签只能通过 getElementsByTagName 获取
        const vRegex = /v:(.+)/
        const nodeList = Array.from(
          vRegex.test(selector)
            ? container.getElementsByTagName(selector)
            : container.querySelectorAll(selector),
        )
        nodeList.forEach((node) => {
          if (nodeMatches.has(node)) {
            const matches = nodeMatches.get(node)
            matches.push(matcher)
          }
          else {
            nodeMatches.set(node, [matcher])
          }
        })
      }
    })
    return [elementMatchers, textMatchers]
  }

  onCaptureCopy(e, isCut = false) {
    if (e.defaultPrevented) {
      return
    }
    e.preventDefault()
    const [range] = this.quill.selection.getRange()
    if (isNullOrUndefined(range)) {
      return
    }
    const { html, text } = this.onCopy(range, isCut)

    // 兼容IE11浏览器`
    if (!e.clipboardData) {
      e.clipboardData = {
        types: 'text/plain',
        setData: (_type, value) => {
          // @ts-ignore
          return window.clipboardData.setData('Text', value)
        },
      }
    }

    // 复制代码时移除utf8中产生的不间断空格\u00A0
    let plainText = text
    if (html.startsWith('<pre>')) {
      plainText = text.replace(/\u00A0/g, ' ')
    }

    e.clipboardData.setData('text/html', html)
    e.clipboardData.setData('text/plain', plainText)
    if (isCut) {
      this.quill.deleteText(range, Quill.sources.USER)
    }
  }

  onCapturePaste(e: ClipboardEvent) {
    if (e.defaultPrevented || !this.quill.isEnabled()) {
      return
    }
    e.preventDefault()
    const range = this.quill.getSelection(true)
    if (isNullOrUndefined(range)) {
      return
    }

    // 兼容IE11浏览器
    if (!e.clipboardData) {
      // @ts-ignore
      e.clipboardData = {
        types: 'text/plain',
        getData: () => {
          // @ts-ignore
          return window.clipboardData.getData('Text')
        },
      }
    }

    const html = e.clipboardData.getData('text/html') || ''
    const text = e.clipboardData.getData('text/plain') || ''
    const allFiles = Array.from(e.clipboardData.files || [])
    const imageFiles = getClipboardImageFiles(e.clipboardData, allFiles)
    const files = allFiles.length ? allFiles : imageFiles
    const rtf = e.clipboardData.getData('text/rtf') || null

    if (shouldUploadFilesOnly(html, files)) {
      this.quill.uploader.upload(range, files)
      return
    }

    const result = { html: isExcelHtml(html) ? renderStyles(html) : html, text, files: imageFiles, rtf }
    this.onPaste(range, result)
  }

  onPaste(range, { html, text, files: clipboardFiles, rtf }) {
    const hexImages = this.extractImageDataFromRtf(rtf)
    const rootBgColor = getComputedStyle(this.quill.root).backgroundColor
    const formats = this.quill.getFormat(range.index)
    let pastedDelta = this.convert({ text, html }, formats)
    pastedDelta = replaceDeltaWhiteSpace(pastedDelta, rootBgColor)
    const deltaLength = pastedDelta.ops.length

    let loadingTipsContainer
    if (deltaLength > BIG_DELTA_LIMIT) {
      loadingTipsContainer = this.quill.addContainer('ql-loading-tips')
      loadingTipsContainer.innerHTML = this.quill.getLangText('pasting')
    }

    const linePos = { index: range.index, length: range.length }

    const handlePasteContent = (content: any) => {
      const oldDelta = new Delta().retain(linePos.index).delete(linePos.length)
      const delta = oldDelta.concat(content)

      setTimeout(() => {
        this.quill.updateContents(delta, Quill.sources.USER)
        const newSelectionIndex = linePos.index + (content.length ? content.length() : 0)
        this.quill.setSelection(
          newSelectionIndex,
          Quill.sources.SILENT,
        )
        this.quill.scrollSelectionIntoView()
        if (loadingTipsContainer) {
          loadingTipsContainer.remove()
        }
      })
    }

    ;(async () => {
      try {
        const [files, placeholders, imageIndexs] = this.flipFilesArray(
          await this.extractFilesFromDelta(
            pastedDelta,
            clipboardFiles,
            hexImages,
          ),
        )

        if (files.length === 0) {
          handlePasteContent(pastedDelta)
          return
        }

        if (this.quill.options.editorPaste && this.quill.options.editorPaste.observers.length !== 0) {
          this.quill.options.editorPaste.emit({
            files,
            callback: ({ code, message, data }) => {
              if (code === 0) {
                const { imageUrls } = data
                pastedDelta = replaceDeltaImage(
                  pastedDelta,
                  imageUrls,
                  placeholders,
                  imageIndexs,
                )
                handlePasteContent(pastedDelta)
              }
              else {
                console.error('error message:', message)
              }
            },
          })
          return
        }

        const imageUrls = await this.files2urls(files, pastedDelta, imageIndexs)
        pastedDelta = replaceDeltaImage(
          pastedDelta,
          imageUrls,
          placeholders,
          imageIndexs,
        )
        handlePasteContent(pastedDelta)
      }
      catch (_e) {
        handlePasteContent(pastedDelta)
      }
    })()
  }

  files2urls(files: File[], pastedDelta, imageIndexs) {
    return Promise.all(
      files.map(async (imageFile, index) => {
        const range = this.getImgSelection(pastedDelta, imageIndexs[index])
        const urls = await this.quill.uploader.getFileUrls([imageFile], range)
        return urls[0]
      }),
    )
  }

  flipFilesArray(filesArr) {
    const files = []
    const placeholders = []
    const imageIndexs = []
    filesArr.forEach((item: any) => {
      if (!item) {
        return
      }
      const [file, placeholder, imageIndex] = item
      files.push(file)
      placeholders.push(placeholder)
      imageIndexs.push(imageIndex)
    })
    return [files, placeholders, imageIndexs]
  }

  // 将图片从hex转为base64
  convertHexToBase64(hexString) {
    return btoa(
      hexString
        .match(/\w{2}/g)
        .map((char) => {
          return String.fromCharCode(Number.parseInt(char, 16))
        })
        .join(''),
    )
  }

  // 匹配rtf中的图片，存储为{hex, type}对象数组
  extractImageDataFromRtf(rtfData) {
    if (!rtfData) {
      return []
    }

    const regexPictureHeader
      = /{\\pict[\s\S]+?\\bliptag-?\d+(\\blipupi-?\d+)?({\\\*\\blipuid\s?[\da-fA-F]+)?[\s}]*?/
    const regexPicture = new RegExp(
      `(?:(${regexPictureHeader.source}))([\\da-fA-F\\s]+)\\}`,
      'g',
    )
    const images = rtfData.match(regexPicture)
    const result = []

    if (images) {
      for (const image of images) {
        let imageType = ''

        if (image.includes('\\pngblip')) {
          imageType = 'image/png'
        }
        else if (image.includes('\\jpegblip')) {
          imageType = 'image/jpeg'
        }

        if (imageType) {
          result.push({
            hex: image
              .replace(regexPictureHeader, '')
              .replace(/[^\da-fA-F]/g, ''),
            type: imageType,
          })
        }
      }
    }

    return result
  }

  extractFilesFromDelta(delta, clipboardFiles, hexImages?) {
    const pendingFiles = [...(clipboardFiles || [])]
    const pendingHexImages = [...(hexImages || [])]
    let index = -1
    return Promise.all(
      delta.map(async (op) => {
        index++
        const image = typeof op.insert === 'object' ? op.insert?.image : null
        if (!image || image.hasExisted) {
          return
        }

        const src = getPasteImageSrc(image)
        if (isUsablePasteImageSrc(src)) {
          return
        }

        let file
        let isPlaceholderImage = false
        const imageIndex = index
        try {
          // hex 图片存在则为 file:/// 协议本地图片，使用 hex 图片转为 base64 读取
          const hexImage = pendingHexImages.length && pendingHexImages.shift()
          const newImage
            = hexImage
              && `data:${hexImage.type};base64,${this.convertHexToBase64(
                hexImage.hex,
              )}`
          if (newImage) {
            file = await imageUrlToFile(newImage)
          }
          else if (pendingFiles.length) {
            file = pendingFiles.shift()
          }
          else if (src) {
            file = await imageUrlToFile(src)
          }
        }
        catch (_err) {
          if (pendingFiles.length) {
            file = pendingFiles.shift()
          }
          else {
            const errorImagePlaceholderJpg
              = this.quill.getLangText('img-error') === 'Image Copy Error'
                ? ERROR_IMAGE_PLACEHOLDER_EN
                : ERROR_IMAGE_PLACEHOLDER_CN
            file = await imageUrlToFile(errorImagePlaceholderJpg, true)
            isPlaceholderImage = true
          }
        }

        if (!file) {
          return
        }
        return [file, isPlaceholderImage, imageIndex]
      }),
    )
  }

  getImgSelection(delta, imageIndex) {
    let length = 0
    delta.ops.every((op, index) => {
      if (index === imageIndex) {
        return false
      }
      if (typeof op.insert === 'string') {
        length += op.insert.length
      }
      else if (typeof op.insert === 'object') {
        // 对于图片、提及等对象类型的 insert，长度为 1
        length += 1
      }
      return true
    })
    const range = {
      index: length,
      length: 0,
    }
    return range
  }
}

function replaceDeltaWhiteSpace(delta, rootBgColor?) {
  return delta.reduce((newDelta, op) => {
    // fix: 当粘贴文字颜色和编辑器背景色一致且自身无背景色的情况下移除文字颜色样式，避免误导用户粘贴无效
    if (
      rootBgColor
      && op.attributes
      && op.attributes.color
      && !op.attributes.background
    ) {
      const originColor = op.attributes.color
      const fontColor
        = originColor.indexOf('#') === 0 ? hexToRgbA(originColor) : originColor
      if (
        fontColor === rootBgColor
        || (fontColor === 'rgba(255,255,255,1)'
          && rootBgColor === 'rgba(0, 0, 0, 0)')
      ) {
        delete op.attributes.color
      }
    }
    if (op.insert && typeof op.insert === 'string') {
      const lines = splitWithBreak(op.insert)
      let insertWithWhiteSpace = ''
      lines.forEach((text) => {
        insertWithWhiteSpace += replaceStrWhiteSpace(text)
      })
      newDelta.insert(insertWithWhiteSpace, op.attributes)
    }
    else {
      newDelta.insert(op.insert, op.attributes)
    }
    return newDelta
  }, new Delta())
}

function renderStyles(html) {
  let htmlString = html
  // Trim unnecessary parts.
  htmlString = htmlString.substring(
    htmlString.indexOf('<html '),
    htmlString.length,
  )
  htmlString = htmlString.substring(
    0,
    htmlString.lastIndexOf('</html>') + '</html>'.length,
  )

  // Add temporary iframe.
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  iframeDoc.open()
  iframeDoc.write(htmlString)
  iframeDoc.close()

  let collection
  let pointer
  const rules
    = iframeDoc.styleSheets[iframeDoc.styleSheets.length - 1].cssRules

  // Convert internal styles to inline style of respective node.
  for (let idx = 0; idx < rules.length; idx++) {
    if ((rules[idx] as CSSStyleRule).selectorText === '') {
      continue
    }
    collection = iframeDoc.body.querySelectorAll(
      (rules[idx] as CSSStyleRule).selectorText,
    )

    for (pointer = 0; pointer < collection.length; pointer++) {
      collection[pointer].style.cssText += (
        rules[idx] as CSSStyleRule
      ).style.cssText
    }
  }

  // @ts-ignore
  const convertedString = iframeDoc.firstChild.outerHTML
  // Remove temporary iframe.
  iframe.parentNode.removeChild(iframe)

  return convertedString
}

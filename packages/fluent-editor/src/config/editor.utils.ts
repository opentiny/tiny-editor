import Quill from 'quill'

const Delta = Quill.import('delta')

// color hex to rgba
export function hexToRgbA(hex: string) {
  let color
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    color = hex.substring(1).split('')
    if (color.length === 3) {
      color = [color[0], color[0], color[1], color[1], color[2], color[2]]
    }
    color = `0x${color.join('')}`
    return (
      `rgba(${
        [(color >> 16) & 255, (color >> 8) & 255, color & 255].join(',')
      },1)`
    )
  }
}

/**
 * 将File格式的图片转换成Url格式
 * @param imageFile File格式的图片
 */
export function imageFileToUrl(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.onerror = reject
  }).catch((error) => {
    console.error('Error reading file:', error)
  })
}

/**
 * 将Url格式的图片转换成File格式
 * @param imageUrl 图片的URL
 */
export function imageUrlToFile(imageUrl, isErrorImage?: boolean) {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then(res => res.blob())
      .then((blob) => {
        if (!blob.type.includes('image') || !blob.type) {
          return reject()
        }
        const fileType = blob.type.replace(/^.*\//, '')
        const fileName = isErrorImage
          ? 'editorx-error-image.png'
          : `image-${new Date().getTime()}.${fileType}`
        const file = new File([blob], fileName, blob)
        resolve(file)
      })
      .catch(reject)
  })
}

export function isNullOrUndefined(param) {
  return param === null || param === undefined
}

/**
 * omit
 * @param   obj         target Object
 * @param   uselessKeys  keys of removed properties
 * @return             new Object without useless properties
 */
export function omit(obj, uselessKeys) {
  return (
    obj
    && Object.keys(obj).reduce((acc, key) => {
      return uselessKeys.includes(key) ? acc : { ...acc, [key]: obj[key] }
    }, {})
  )
}

/**
 * 将delta中的图片替换成制定的图片数组，用于图片上传到服务器的场景
 * @param delta 原始delta
 * @param imageUrls 图片数组
 * @param imagePlaceholder 标识是否是占位图的数组，与图片数组一一对应
 * @param imageIndexs 需要替换的图片在 delta.ops 中的下标；不传则替换全部新图片
 * @return 替换之后的delta
 */
export function replaceDeltaImage(delta, imageUrls, imagePlaceholder, imageIndexs?) {
  const indexSet = Array.isArray(imageIndexs) ? new Set(imageIndexs) : null
  let imageIndex = 0
  let opIndex = -1
  return delta.reduce((newDelta, op) => {
    opIndex++
    const image = typeof op.insert === 'object' ? op.insert?.image : null
    if (image && !image.hasExisted) {
      if (indexSet && !indexSet.has(opIndex)) {
        newDelta.insert(op.insert, op.attributes)
        return newDelta
      }
      const nextUrl = imageUrls[imageIndex]
      const attributes = imagePlaceholder[imageIndex]
        ? { ...op.attributes, width: 'auto', height: 225 } // 占位图片应该固定大小
        : op.attributes
      imageIndex++
      if (nextUrl) {
        newDelta.insert({ image: nextUrl }, attributes)
      }
      else {
        newDelta.insert(op.insert, op.attributes)
      }
    }
    else {
      newDelta.insert(op.insert, op.attributes)
    }
    return newDelta
  }, new Delta())
}

const WHITE_SPACE_CHAR_RE = /^[\u3000\u0020]$/
const WHITE_SPACE_OR_NBSP_RE = /^[\u3000\u0020\u00A0]$/

/**
 * 将连续空格转为不间断空格，以便 innerHTML 输出 &nbsp; 并在预览中保留间距。
 * - 行首空白：全部转为 \u00A0
 * - 正文内连续空白：保留第一个普通空格，其余转为 \u00A0
 */
export function replaceStrWhiteSpace(str: string) {
  let textWithWhiteSpace = ''
  let beginHasChar = false
  let consecutiveSpaces = 0
  for (const char of str) {
    if (WHITE_SPACE_CHAR_RE.test(char)) {
      consecutiveSpaces += 1
      if (!beginHasChar) {
        textWithWhiteSpace += '\u00A0'
      }
      else if (consecutiveSpaces === 1) {
        textWithWhiteSpace += char
      }
      else {
        textWithWhiteSpace += '\u00A0'
      }
    }
    else {
      consecutiveSpaces = 0
      textWithWhiteSpace += char
      beginHasChar = true
    }
  }
  return textWithWhiteSpace
}

/** 空格键是否应插入不间断空格（与 replaceStrWhiteSpace 规则一致） */
export function shouldInsertNbspOnSpace(prefix: string) {
  if (!prefix) {
    return true
  }
  const lastChar = prefix.slice(-1)
  return WHITE_SPACE_OR_NBSP_RE.test(lastChar)
}

export function splitWithBreak(insertContent: string) {
  const lines = []
  const insertStr = insertContent
  let start = 0
  for (let i = 0; i < insertContent.length; i++) {
    if (insertStr.charAt(i) === '\n') {
      if (i === 0) {
        lines.push('\n')
      }
      else {
        lines.push(insertStr.substring(start, i))
        lines.push('\n')
      }
      start = i + 1
    }
  }

  const tailStr = insertStr.substring(start)
  if (tailStr) {
    lines.push(tailStr)
  }

  return lines
}

/**
 * getEventComposedPath
 *  compatibility fixed for Event.path/Event.composedPath
 *  Event.path is only for chrome/opera
 *  Event.composedPath is for Safari, FF
 *  Neither for Micro Edge
 * @return an array of event.path
 */
export function getEventComposedPath(evt) {
  let path
  // chrome, opera, safari, firefox
  path = evt.path || (evt.composedPath && evt.composedPath())

  // other: edge
  if (path === undefined && evt.target) {
    path = []
    let target = evt.target
    path.push(target)

    while (target && target.parentNode) {
      target = target.parentNode
      path.push(target)
    }
  }

  return path
}

export function sanitize(url, protocols) {
  const anchor = document.createElement('a')
  anchor.href = url
  const protocol = anchor.href.slice(0, anchor.href.indexOf(':'))
  return protocols.includes(protocol)
}

export function hadProtocol(url: string) {
  if (!url || !/^(?:f|ht)tps?\:\/\//.test(url)) {
    return false
  }
  return true
}

export function isInside(position, dom) {
  const areaPosition = dom.getBoundingClientRect()
  const { pageX, pageY } = position
  // getBoundingClientRect是不考虑窗口滚动的
  const left = pageX - window.scrollX
  const top = pageY - window.scrollY
  const {
    left: areaLeft,
    top: areaTop,
    width: areaWidth,
    height: areaHeight,
  } = areaPosition
  const inside
    = left > areaLeft
      && left < areaLeft + areaWidth
      && top > areaTop
      && top < areaTop + areaHeight
  return inside
}

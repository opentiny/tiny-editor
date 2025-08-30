import type Quill from 'quill'
import type { BackgroundConfig, LineConfig } from './options'

export function getBackgroundConfig(quill: Quill | null): false | object {
  const MindMapModule = quill?.options.modules?.['mind-map']
  if (!MindMapModule || typeof MindMapModule !== 'object') {
    return false
  }
  if ('background' in MindMapModule) {
    const background = MindMapModule.background as BackgroundConfig | boolean | undefined

    if (background === false || background === undefined) {
      return false
    }
    if (typeof background === 'object' && background !== null) {
      const typedBackground = background as BackgroundConfig
      const backgroundConfig: any = {}

      if (typedBackground.color) {
        backgroundConfig.backgroundColor = typedBackground.color
      }
      if (typedBackground.image) {
        backgroundConfig.backgroundImage = typedBackground.image
      }
      if (typedBackground.repeat) {
        backgroundConfig.backgroundRepeat = typedBackground.repeat
      }
      if (typedBackground.position) {
        backgroundConfig.backgroundPosition = typedBackground.position
      }
      if (typedBackground.size) {
        backgroundConfig.backgroundSize = typedBackground.size
      }
      return backgroundConfig
    }
  }
  return false
}

export function getLineConfig(quill: Quill | null): false | object {
  const MindMapModule = quill?.options.modules?.['mind-map']
  if (!MindMapModule || typeof MindMapModule !== 'object') {
    return false
  }
  if ('line' in MindMapModule) {
    const line = MindMapModule.line as LineConfig | boolean | undefined

    if (line === false || line === undefined) {
      return false
    }
    if (typeof line === 'object' && line !== null) {
      const typedLine = line as LineConfig
      const lineConfig: any = {}

      if (typedLine.color) {
        lineConfig.lineColor = typedLine.color
      }
      if (typedLine.width) {
        lineConfig.lineWidth = typedLine.width
      }
      if (typedLine.dasharray) {
        lineConfig.lineDasharray = typedLine.dasharray
      }
      if (typedLine.style) {
        lineConfig.lineStyle = typedLine.style
      }
      return lineConfig
    }
  }
  return false
}

export function getResizeConfig(quill: Quill | null): boolean {
  const MindMapModule = quill?.options.modules?.['mind-map']
  if (!MindMapModule || typeof MindMapModule !== 'object') {
    return false
  }
  if ('resize' in MindMapModule) {
    const resize = (MindMapModule as any).resize as boolean | undefined
    return resize === true
  }
  return false
}

export function getThemeConfig(quill: Quill | null): string {
  const MindMapModule = quill?.options.modules?.['mind-map']
  if (!MindMapModule || typeof MindMapModule !== 'object') {
    return 'default'
  }
  if ('theme' in MindMapModule) {
    const theme = MindMapModule.theme as string | undefined
    return theme || 'default'
  }
  return 'default'
}

export function getAllConfigs(quill: Quill | null): {
  backgroundConfig: false | object
  resizeConfig: boolean
  lineConfig: false | object
  themeConfig: string
} {
  return {
    backgroundConfig: getBackgroundConfig(quill),
    resizeConfig: getResizeConfig(quill),
    lineConfig: getLineConfig(quill),
    themeConfig: getThemeConfig(quill),
  }
}

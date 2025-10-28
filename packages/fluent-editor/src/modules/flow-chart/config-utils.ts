import type Quill from 'quill'
import type { BackgroundConfig, GridOptions } from './options'

export function getGridConfig(quill: Quill | null): any {
  const defaultGrid = {
    size: 20,
    visible: true,
    type: 'dot',
    config: {
      color: '#ababab',
      thickness: 1,
    },
  }

  const flowChartModule = quill?.options.modules?.['flow-chart']
  if (!flowChartModule || typeof flowChartModule !== 'object') {
    return defaultGrid
  }

  if ('grid' in flowChartModule) {
    const grid = flowChartModule.grid as GridOptions | boolean | undefined
    if (grid === false || grid === undefined) {
      return null
    }

    if (typeof grid === 'object' && grid !== null) {
      const typedGrid = grid as GridOptions
      const gridConfig = {
        size: typedGrid.size || defaultGrid.size,
        visible: typedGrid.visible !== undefined ? typedGrid.visible : defaultGrid.visible,
        type: typedGrid.type || defaultGrid.type,
        config: {
          color: typedGrid.config?.color || defaultGrid.config.color,
          thickness: typedGrid.config?.thickness || defaultGrid.config.thickness,
        },
      }

      return gridConfig
    }
  }

  return defaultGrid
}

export function getBackgroundConfig(quill: Quill | null): false | object {
  const flowChartModule = quill?.options.modules?.['flow-chart']
  if (!flowChartModule || typeof flowChartModule !== 'object') {
    return false
  }
  if ('background' in flowChartModule) {
    const background = flowChartModule.background as BackgroundConfig | boolean | undefined

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
      if (typedBackground.opacity) {
        backgroundConfig.opacity = typedBackground.opacity
      }
      return backgroundConfig
    }
  }
  return false
}

export function getResizeConfig(quill: Quill | null): boolean {
  const flowChartModule = quill?.options.modules?.['flow-chart']
  if (!flowChartModule || typeof flowChartModule !== 'object') {
    return false
  }
  if ('resize' in flowChartModule) {
    const resize = (flowChartModule as any).resize as boolean | undefined
    return resize === true
  }
  return false
}

export function getAllConfigs(quill: Quill | null): {
  gridConfig: any
  backgroundConfig: false | object
  resizeConfig: boolean
  deps?: any
} {
  const deps = (quill?.options.modules?.['flow-chart'] as any)?.deps
  return {
    gridConfig: getGridConfig(quill),
    backgroundConfig: getBackgroundConfig(quill),
    resizeConfig: getResizeConfig(quill),
    deps,
  }
}

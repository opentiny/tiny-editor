export interface BackgroundConfig {
  color?: string
  image?: string
  repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  position?: string
  size?: string
}

export interface LineConfig {
  color?: string
  width?: number
  dasharray?: string
  style?: 'curve' | 'straight' | 'direct'
}

export interface MindMapDeps {
  SimpleMindMap: any
  Themes: any
  Drag: any
  Export: any
}

export interface MindMapOptions {
  background?: boolean | BackgroundConfig
  resize?: boolean
  line?: boolean | LineConfig
  theme?: string
  deps?: MindMapDeps
}

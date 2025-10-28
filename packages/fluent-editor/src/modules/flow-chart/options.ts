export interface GridOptions {
  size?: number
  visible?: boolean
  type?: 'dot' | 'mesh'
  config?: {
    color: string
    thickness?: number
  }
}
export interface BackgroundConfig {
  color?: string
  image?: string
  repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  position?: string
  size?: string
  opacity?: number
}

export interface FlowChartDeps {
  SimpleMindMap: any
  Themes: any
  Drag: any
  Export: any
}

export interface FlowChartOptions {
  grid?: boolean | GridOptions
  background?: boolean | BackgroundConfig
  resize?: boolean
  deps: FlowChartDeps
}

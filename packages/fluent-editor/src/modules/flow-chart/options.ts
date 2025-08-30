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
export interface BaseEdgeConfig {
  stroke?: string
  strokeWidth?: number
}

export interface FlowChartOptions {
  grid?: boolean | GridOptions
  background?: boolean | BackgroundConfig
  resize?: boolean
  baseEdge?: boolean | BaseEdgeConfig
  theme?: string
}

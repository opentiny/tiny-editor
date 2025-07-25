import type * as Y from 'yjs'
import type { AwarenessOptions, IndexedDBOptions } from './awareness'
import type { WebRTCProviderOptions, WebsocketProviderOptions } from './provider'

export interface ProviderEventHandlers {
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onSyncChange?: (isSynced: boolean) => void
}
export interface BaseYjsProviderConfig extends ProviderEventHandlers {
  options: Record<string, any>
  type: string
}

export type WebRTCProviderConfig = BaseYjsProviderConfig & {
  options: WebRTCProviderOptions
  type: 'webrtc'
}
export type WebsocketProviderConfig = BaseYjsProviderConfig & {
  options: WebsocketProviderOptions
  type: 'websocket'
}

export type CustomProviderConfig = BaseYjsProviderConfig & {
  options: Record<string, any>
  type: string
}

export type CursorsConfig = boolean | object

export interface YjsOptions {
  ydoc?: Y.Doc
  provider: (WebRTCProviderConfig | WebsocketProviderConfig | CustomProviderConfig)
  awareness?: AwarenessOptions
  offline?: boolean | IndexedDBOptions
  cursors?: CursorsConfig

  // callback
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error) => void
  onSyncChange?: (isSynced: boolean) => void
}

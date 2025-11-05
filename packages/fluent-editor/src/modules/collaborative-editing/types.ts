import type QuillCursors from 'quill-cursors'
import type { IndexeddbPersistence } from 'y-indexeddb'
import type { Awareness } from 'y-protocols/awareness'
import type { QuillBinding } from 'y-quill'
import type { WebrtcProvider } from 'y-webrtc'
import type { WebsocketProvider } from 'y-websocket'
import type * as Y from 'yjs'
import type { AwarenessOptions } from './awareness'
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

export interface CollaborativeEditingDeps {
  Y: typeof Y
  Awareness: typeof Awareness
  QuillBinding: typeof QuillBinding
  QuillCursors: typeof QuillCursors
  WebsocketProvider?: typeof WebsocketProvider
  WebrtcProvider?: typeof WebrtcProvider
  IndexeddbPersistence?: typeof IndexeddbPersistence
}

export interface YjsOptions {
  ydoc?: Y.Doc
  provider: (WebRTCProviderConfig | WebsocketProviderConfig | CustomProviderConfig)
  awareness?: AwarenessOptions
  offline?: boolean
  cursors?: CursorsConfig
  deps?: CollaborativeEditingDeps

  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onSyncChange?: (isSynced: boolean) => void
}

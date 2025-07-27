import type { ProviderEventHandlers } from '../types'
import type { UnifiedProvider } from './customProvider'
import { Awareness } from 'y-protocols/awareness'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

export interface WebsocketProviderOptions extends ProviderEventHandlers {
  serverUrl: string
  roomName: string
  connect?: boolean
  awareness?: any
  params?: Record<string, string>
  protocols?: string[]
  WebSocketPolyfill?: typeof WebSocket
  resyncInterval?: number
  maxBackoffTime?: number
  disableBc?: boolean
}

export class WebsocketProviderWrapper implements UnifiedProvider {
  private provider: WebsocketProvider

  private _isConnected = false
  private _isSynced = false

  private onConnect?: () => void
  private onDisconnect?: () => void
  private onError?: (error: Error) => void
  private onSyncChange?: (isSynced: boolean) => void

  document: Y.Doc
  awareness: Awareness
  type: 'websocket'

  connect = () => {
    try {
      this.provider.connect()
    }
    catch (error) {
      console.warn('[yjs] Error connecting WebSocket provider:', error)
    }
  }

  destroy = () => {
    try {
      this.provider.destroy()
    }
    catch (error) {
      console.warn('[yjs] Error destroying WebSocket provider:', error)
    }
  }

  disconnect = () => {
    try {
      this.provider.disconnect()
      const wasSynced = this._isSynced

      this._isConnected = false
      this._isSynced = false

      if (wasSynced) {
        this.onSyncChange?.(false)
      }
    }
    catch (error) {
      console.warn('[yjs] Error disconnecting WebSocket provider:', error)
    }
  }

  constructor({
    awareness,
    doc,
    options,
    onConnect,
    onDisconnect,
    onError,
    onSyncChange,
  }: {
    options: WebsocketProviderOptions
    awareness?: Awareness
    doc?: Y.Doc
  } & ProviderEventHandlers) {
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.onError = onError
    this.onSyncChange = onSyncChange

    this.document = doc || new Y.Doc()
    this.awareness = awareness ?? new Awareness(this.document)
    try {
      this.provider = new WebsocketProvider(
        options.serverUrl,
        options.roomName,
        this.document,
        {
          awareness: this.awareness,
          ...options,
        },
      )

      this.provider.on('status', (event: { status: 'connected' | 'disconnected' | 'connecting' }) => {
        const wasConnected = this._isConnected
        this._isConnected = event.status === 'connected'

        if (event.status === 'connected') {
          if (!wasConnected) {
            this.onConnect?.()
          }
          if (!this._isSynced) {
            this._isSynced = true
            this.onSyncChange?.(true)
          }
        }
        else if (event.status === 'disconnected') {
          if (wasConnected) {
            this.onDisconnect?.()
            if (this._isSynced) {
              this._isSynced = false
              this.onSyncChange?.(false)
            }
          }
        }
      })
    }
    catch (error) {
      console.warn('[yjs] Error creating WebSocket provider:', error)
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }

  get isConnected() {
    return this._isConnected
  }

  get isSynced() {
    return this._isSynced
  }

  getProvider() {
    return this.provider
  }
}

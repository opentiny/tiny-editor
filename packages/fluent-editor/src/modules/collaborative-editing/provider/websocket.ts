import type { Awareness } from 'y-protocols/awareness'
import type { WebsocketProvider } from 'y-websocket'
import type * as Y from 'yjs'
import type { CollaborativeEditingDeps, ProviderEventHandlers } from '../types'
import type { UnifiedProvider } from './providerRegistry'

export interface WebsocketProviderOptions {
  serverUrl: string
  roomName: string
  connect?: boolean
  awareness?: Awareness
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

  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onSyncChange?: (isSynced: boolean) => void

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
    deps,
  }: {
    options: WebsocketProviderOptions
    awareness?: Awareness
    doc?: Y.Doc
    deps?: CollaborativeEditingDeps
  } & ProviderEventHandlers) {
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.onError = onError
    this.onSyncChange = onSyncChange

    const { Y, Awareness, WebsocketProvider } = deps || (window as any)

    if (!WebsocketProvider) {
      throw new Error('WebsocketProvider dependency not provided')
    }

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

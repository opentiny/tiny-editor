import type { Awareness } from 'y-protocols/awareness'
import type { WebrtcProvider } from 'y-webrtc'
import type * as Y from 'yjs'
import type { CollaborativeEditingDeps, ProviderEventHandlers } from '../types'
import type { UnifiedProvider } from './providerRegistry'

export interface WebRTCProviderOptions {
  roomName: string
  filterBcConns?: boolean
  maxConns?: number
  password?: string
  peerOpts?: Record<string, unknown>
  signaling?: string[]
}

export class WebRTCProviderWrapper implements UnifiedProvider {
  private provider: WebrtcProvider
  private _isConnected = false
  private _isSynced = false

  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onSyncChange?: (isSynced: boolean) => void

  document: Y.Doc
  awareness: Awareness
  type: 'webrtc'

  connect = () => {
    try {
      this.provider.connect()
    }
    catch (error) {
      console.warn('[yjs] Error connecting WebRTC provider:', error)
    }
  }

  destroy = () => {
    try {
      this.provider.destroy()
    }
    catch (error) {
      console.warn('[yjs] Error destroying WebRTC provider:', error)
    }
  }

  disconnect = () => {
    try {
      this.provider.disconnect()
      this._isConnected = false
      this._isSynced = false
    }
    catch (error) {
      console.warn('[yjs] Error disconnecting WebRTC provider:', error)
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
    options: WebRTCProviderOptions
    awareness?: Awareness
    doc?: Y.Doc
    deps?: CollaborativeEditingDeps
  } & ProviderEventHandlers) {
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.onError = onError
    this.onSyncChange = onSyncChange

    const { Y, Awareness, WebrtcProvider } = deps || (window as any)

    if (!WebrtcProvider) {
      throw new Error('WebrtcProvider dependency not provided')
    }

    this.document = doc || new Y.Doc()
    this.awareness = awareness ?? new Awareness(this.document)
    try {
      this.provider = new WebrtcProvider(options.roomName, this.document, {
        awareness: this.awareness,
        ...options,
      })

      this.provider.on('status', (status: { connected: boolean }) => {
        const wasConnected = this._isConnected
        this._isConnected = status.connected
        if (status.connected) {
          if (!wasConnected) {
            this.onConnect?.()
          }
          if (!this._isSynced) {
            this._isSynced = true
            this.onSyncChange?.(true)
          }
        }
        else {
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
      console.warn('[yjs] Error creating WebRTC provider:', error)
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

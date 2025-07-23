import type { Awareness } from 'y-protocols/awareness'
import type { ProviderEventHandlers } from '../types'
import type { UnifiedProvider } from './customProvider'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

export interface WebRTCProviderOptions {
  roomname: string
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
  private doc: Y.Doc

  private onConnect?: () => void
  private onDisconnect?: () => void
  private onError?: (error: Error) => void
  private onSyncChange?: (isSynced: boolean) => void

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
  }: {
    options: WebRTCProviderOptions
    awareness?: Awareness
    doc?: Y.Doc
  } & ProviderEventHandlers) {
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.onError = onError
    this.onSyncChange = onSyncChange

    this.doc = doc || new Y.Doc()
    try {
      this.provider = new WebrtcProvider(options.roomname, this.doc, {
        awareness,
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
              onSyncChange?.(false)
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

  type: 'webrtc'

  get awareness(): Awareness {
    return this.provider!.awareness
  }

  get document() {
    return this.doc
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

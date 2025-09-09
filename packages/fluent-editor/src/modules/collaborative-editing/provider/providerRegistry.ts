import type { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'
import type { ProviderEventHandlers } from '../types'
import { WebRTCProviderWrapper } from './webrtc'
import { WebsocketProviderWrapper } from './websocket'

export type ProviderRegistry = Record<string, ProviderConstructor>

export type ProviderConstructor<T = any> = new (
  props: ProviderConstructorProps<T>
) => UnifiedProvider

export type ProviderConstructorProps<T = any> = {
  options: T
  awareness?: Awareness
  doc?: Y.Doc
} & ProviderEventHandlers

export interface UnifiedProvider {
  awareness: Awareness
  document: Y.Doc
  type: 'webrtc' | 'websocket' | string
  connect: () => void
  destroy: () => void
  disconnect: () => void
  isConnected: boolean
  isSynced: boolean
}

const providerRegistry: ProviderRegistry = {
  websocket: WebsocketProviderWrapper,
  webrtc: WebRTCProviderWrapper,
}

export function registerProviderType<T>(type: string, providerClass: ProviderConstructor<T>) {
  providerRegistry[type as string]
    = providerClass as ProviderConstructor
}

export function getProviderClass(type: string): ProviderConstructor | undefined {
  return providerRegistry[type]
}

export function createProvider({
  type,
  ...props
}: ProviderConstructorProps & {
  type: string
}) {
  const ProviderClass = getProviderClass(type)

  if (!ProviderClass) {
    throw new Error(`Provider type "${type}" not found in registry`)
  }

  return new ProviderClass(props)
}

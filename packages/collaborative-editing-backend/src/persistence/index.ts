import type * as Y from 'yjs'

export interface Persistence {
  connect: () => Promise<void>
  bindState: (docName: string, doc: Y.Doc) => Promise<void>
  writeState: (docName: string, doc: Y.Doc) => Promise<void>
  close?: () => Promise<void>
}

let persistence: Persistence | null = null

export function setPersistence(p: Persistence | null) {
  persistence = p
}

export const getPersistence = () => persistence

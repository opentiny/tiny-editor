import type { Doc } from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

export interface IndexedDBOptions {
  dbName: string
}

export function setupIndexedDB(doc: Doc, options?: IndexedDBOptions) {
  const id = 'tiny-editor'
  const dbName = options?.dbName || 'document'
  return new IndexeddbPersistence(`${id}-${dbName}`, doc)
}

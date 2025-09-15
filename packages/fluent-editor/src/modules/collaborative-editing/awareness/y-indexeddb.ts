import type { Doc } from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

export function setupIndexedDB(doc: Doc): () => void {
  const fullDbName = `tiny-editor-${doc.guid}`

  new IndexeddbPersistence(fullDbName, doc)

  return (): void => {
    indexedDB.deleteDatabase(fullDbName)
  }
}

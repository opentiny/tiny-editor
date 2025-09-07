import type { Doc } from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

export function setupIndexedDB(doc: Doc): () => Promise<void> {
  const fullDbName = `tiny-editor-${doc.guid}`

  new IndexeddbPersistence(fullDbName, doc)

  return (): Promise<void> => {
    return new Promise((resolve, reject) => {
      indexedDB.deleteDatabase(fullDbName)
    })
  }
}

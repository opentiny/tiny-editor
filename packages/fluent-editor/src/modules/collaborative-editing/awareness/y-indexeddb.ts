import type { IndexeddbPersistence } from 'y-indexeddb'
import type * as Y from 'yjs'

export function setupIndexedDB(doc: Y.Doc, IndexeddbPersistenceClass?: typeof IndexeddbPersistence): () => void {
  if (!IndexeddbPersistenceClass) {
    console.warn('[yjs] IndexeddbPersistence not provided, offline support disabled')
    return () => {}
  }

  const fullDbName = `tiny-editor-${doc.guid}`

  new IndexeddbPersistenceClass(fullDbName, doc)

  return (): void => {
    indexedDB.deleteDatabase(fullDbName)
  }
}

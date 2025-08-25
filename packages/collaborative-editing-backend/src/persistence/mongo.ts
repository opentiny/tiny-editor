import type { Db } from 'mongodb'
import type { Persistence } from './index.ts'
import { MongoClient } from 'mongodb'
import { MongodbPersistence } from 'y-mongodb-provider'
import * as Y from 'yjs'
import { MONGODB_COLLECTION, MONGODB_DB, MONGODB_URL } from '../env.ts'

interface MongoConnectionObj {
  client: MongoClient
  db: Db
}

export class MongoPersistence implements Persistence {
  private mongodbPersistence: MongodbPersistence
  private client: MongoClient
  private connected = false

  constructor() {
    if (!MONGODB_URL) throw new Error('缺少必需的环境变量: MONGODB_URL')
    if (!MONGODB_DB) throw new Error('缺少必需的环境变量: MONGODB_DB')
    if (!MONGODB_COLLECTION) throw new Error('缺少必需的环境变量: MONGODB_COLLECTION')

    this.client = new MongoClient(MONGODB_URL, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    })
    const db = this.client.db(MONGODB_DB)
    const connectionObj: MongoConnectionObj = { client: this.client, db }

    this.mongodbPersistence = new MongodbPersistence(connectionObj, {
      collectionName: MONGODB_COLLECTION,
      flushSize: 50,
      multipleCollections: true,
    })
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect()
      this.connected = true
    }
  }

  async bindState(docName: string, ydoc: Y.Doc) {
    await this.connect()

    const persistedYDoc = await this.mongodbPersistence.getYDoc(docName)

    const newUpdates = Y.encodeStateAsUpdate(ydoc)
    if (newUpdates.byteLength > 0) {
      this.mongodbPersistence.storeUpdate(docName, newUpdates)
    }

    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYDoc))

    ydoc.on('update', (update: Uint8Array) => {
      this.mongodbPersistence.storeUpdate(docName, update)
    })
  }

  async writeState(docName: string, ydoc: Y.Doc) {
    return Promise.resolve()
  }

  async close() {
    this.mongodbPersistence.destroy()
    await this.client.close()
  }
}

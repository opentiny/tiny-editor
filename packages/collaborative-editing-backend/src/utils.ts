import type { IncomingMessage } from 'node:http'
import type WebSocket from 'ws'
import * as awarenessProtocol from '@y/protocols/awareness.js'
import * as syncProtocol from '@y/protocols/sync.js'
import * as decoding from 'lib0/decoding'
import * as encoding from 'lib0/encoding'
import * as map from 'lib0/map'
import * as Y from 'yjs'

import { GC_ENABLED } from './env.ts'
import { getPersistence } from './persistence/index.ts'

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1

export const docs: Map<string, WSSharedDoc> = new Map()

const messageSync = 0
const messageAwareness = 1

function updateHandler(update: Uint8Array, _origin: any, doc: Y.Doc): void {
  const wsDoc = doc as WSSharedDoc
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  wsDoc.conns.forEach((_, conn) => send(wsDoc, conn, message))
}

let contentInitializor: (ydoc: Y.Doc) => Promise<void> = (_ydoc: Y.Doc) => Promise.resolve()
export function setContentInitializor(f: (ydoc: Y.Doc) => Promise<void>): void {
  contentInitializor = f
}

export class WSSharedDoc extends Y.Doc {
  name: string
  conns: Map<WebSocket, Set<number>>
  awareness: awarenessProtocol.Awareness
  whenInitialized: Promise<void>

  constructor(name: string) {
    super({ gc: GC_ENABLED })
    this.name = name
    this.conns = new Map()
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)

    const awarenessChangeHandler = (
      { added, updated, removed }: { added: number[], updated: number[], removed: number[] },
      conn: WebSocket | null,
    ): void => {
      const changedClients = added.concat(updated, removed)
      if (conn !== null) {
        const connControlledIDs = this.conns.get(conn)
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID)
          })
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID)
          })
        }
      }
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
      const buff = encoding.toUint8Array(encoder)
      this.conns.forEach((_, c) => send(this, c, buff))
    }

    this.awareness.on('update', awarenessChangeHandler)
    this.on('update', updateHandler)
    this.whenInitialized = contentInitializor(this)
  }
}

export function getYDoc(docname: string, gc = true): WSSharedDoc {
  return map.setIfUndefined(docs as Map<string, WSSharedDoc>, docname, () => {
    const doc = new WSSharedDoc(docname)
    doc.gc = gc
    const persistence = getPersistence()
    if (persistence !== null) {
      persistence.bindState(docname, doc)
    }
    return doc
  })
}
function messageListener(conn: WebSocket, doc: WSSharedDoc, message: Uint8Array): void {
  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn)
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }
        break
      case messageAwareness:
        awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn)
        break
    }
  }
  catch (err) {
    console.error(err)
  }
}

function closeConn(doc: WSSharedDoc, conn: WebSocket): void {
  if (doc.conns.has(conn)) {
    const controlledIds = doc.conns.get(conn)!
    doc.conns.delete(conn)
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null)
    const persistence = getPersistence()
    if (doc.conns.size === 0 && persistence !== null) {
      persistence.writeState(doc.name, doc).then(() => {
        if (doc.conns.size === 0) {
          doc.destroy()
          docs.delete(doc.name)
        }
      })
      docs.delete(doc.name)
    }
  }
  try {
    conn.close()
  }
  catch (e) { console.warn(e) }
}

function send(doc: WSSharedDoc, conn: WebSocket, m: Uint8Array): void {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    closeConn(doc, conn)
  }
  try {
    conn.send(m, (err) => {
      if (err != null) closeConn(doc, conn)
    })
  }
  catch (e) {
    closeConn(doc, conn)
  }
}

const pingTimeout = 30000

interface SetupOptions {
  docName?: string
  gc?: boolean
}

export function setupWSConnection(
  conn: WebSocket,
  req: IncomingMessage,
  { docName = (req.url || '').slice(1).split('?')[0], gc = true }: SetupOptions = {},
): void {
  conn.binaryType = 'arraybuffer'
  const doc = getYDoc(docName, gc)
  doc.conns.set(conn, new Set())
  conn.on('message', (message: ArrayBuffer) => messageListener(conn, doc, new Uint8Array(message)))

  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn)
      }
      clearInterval(pingInterval)
    }
    else if (doc.conns.has(conn)) {
      pongReceived = false
      try {
        conn.ping()
      }
      catch (e) {
        closeConn(doc, conn)
        clearInterval(pingInterval)
      }
    }
  }, pingTimeout)

  conn.on('close', () => {
    closeConn(doc, conn)
    clearInterval(pingInterval)
  })

  conn.on('pong', () => {
    pongReceived = true
  })

  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeSyncStep1(encoder, doc)
  send(doc, conn, encoding.toUint8Array(encoder))

  const awarenessStates = doc.awareness.getStates()
  if (awarenessStates.size > 0) {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageAwareness)
    encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())))
    send(doc, conn, encoding.toUint8Array(encoder))
  }
}

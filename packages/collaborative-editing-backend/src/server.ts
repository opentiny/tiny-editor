import http from 'node:http'
import { WebSocketServer } from 'ws'
import { HOST, PORT } from './env.js'
import { setPersistence } from './persistence/index.js'
import { MongoPersistence } from './persistence/mongo.js'
import { setupWSConnection } from './utils.js'

const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

const wss = new WebSocketServer({ server })
wss.on('connection', setupWSConnection)

const mongoPersistence = new MongoPersistence()
setPersistence(mongoPersistence)

server.listen(PORT, HOST, () => {
  console.warn(`Server running on http://${HOST}:${PORT}`)
})

process.on('SIGINT', async () => {
  await mongoPersistence.close?.()
  process.exit(0)
})

import http from 'node:http'
import { WebSocketServer } from 'ws'
import { HOST, PORT } from './env.ts'
import { setPersistence } from './persistence/index.ts'
import { MongoPersistence } from './persistence/mongo.ts'
import { setupWSConnection } from './utils.ts'

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
  await mongoPersistence.close()
  process.exit(0)
})

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

const persistence = new MongoPersistence()
setPersistence(persistence)

persistence.connect().then(() => {
  server.listen(PORT, HOST, () => {
    console.warn(`Server running on http://${HOST}:${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error)
  process.exit(1)
})

process.on('SIGINT', async () => {
  await persistence.close()
  process.exit(0)
})

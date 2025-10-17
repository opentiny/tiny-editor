const fs = require('node:fs')
const path = require('node:path')

const logDir = path.resolve(__dirname, 'log')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

const envFile = path.resolve(__dirname, '.env')
const hasEnvFile = fs.existsSync(envFile)
const nodeArgs = hasEnvFile ? '--env-file=.env --no-warnings' : '--no-warnings'

module.exports = {
  apps: [{
    name: 'collaborative-editor-backend',
    script: './dist/server.js',
    node_args: nodeArgs,
    instances: 1,
    log_file: path.join(logDir, 'app.log'),
    error_file: path.join(logDir, 'error.log'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    watch: false,
    max_restarts: 10,
  }],
}

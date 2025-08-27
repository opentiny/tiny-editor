const fs = require('node:fs')
const path = require('node:path')

const logDir = path.resolve(__dirname, 'log')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

module.exports = {
  apps: [{
    name: 'collaborative-editor-backend',
    script: './dist/server.js',
    node_args: '--env-file=.env --no-warnings',
    instances: 1,
    log_file: path.join(logDir, 'app.log'),
    error_file: path.join(logDir, 'error.log'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    watch: false,
    max_restarts: 10,
  }],
}

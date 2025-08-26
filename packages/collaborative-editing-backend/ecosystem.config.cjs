module.exports = {
  apps: [{
    name: 'collaborative-editor-backend',
    script: './dist/src/server.js',
    node_args: '--env-file=.env --no-warnings',
    instances: 1,
    log_file: './app.log',
    error_file: './error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    watch: false,
    max_restarts: 10,
  }],
}

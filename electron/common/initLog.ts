import log from 'electron-log'
import path from 'path'

log.initialize({ preload: true })
log.transports.file.level = 'debug'
log.transports.file.resolvePathFn = () => path.join(__dirname, 'logs/main.log')

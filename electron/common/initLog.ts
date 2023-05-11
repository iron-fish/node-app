import log from 'electron-log'

log.initialize({ preload: true })
log.transports.file.level = 'debug'
log.transports.file.resolvePathFn = () => 'logs/main.log'

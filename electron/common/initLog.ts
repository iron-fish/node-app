import log from 'electron-log'
import getAppHomeFolder from '../utils/getAppHomeFolder'

log.initialize({ preload: true })
log.transports.file.level = 'debug'
log.transports.file.resolvePathFn = () => getAppHomeFolder('/logs/main.log')

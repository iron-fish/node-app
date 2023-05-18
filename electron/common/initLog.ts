import log from 'electron-log'
import getAppHomeFolder from '../utils/getAppHomeFolder'
import path from 'path'

log.initialize({ preload: true })
log.transports.file.level = 'debug'
log.transports.file.resolvePathFn = () => {
  return path.join(getAppHomeFolder(), 'logs/main.log')
}

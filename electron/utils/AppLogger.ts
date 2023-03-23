import consola, { logType, ConsolaReporterLogObject, LogLevel } from 'consola'
import log from 'electron-log'
import { Logger } from '@ironfish/sdk'

export const loggers: Record<logType, typeof log.log> = {
  fatal: log.error,
  error: log.error,
  warn: log.warn,
  log: log.log,
  info: log.info,
  success: log.info,
  debug: log.debug,
  trace: log.debug,
  verbose: log.verbose,
  ready: log.info,
  start: log.info,
  silent: (): void => null,
}

class AppLogger {
  log(logObj: ConsolaReporterLogObject) {
    const logger = loggers[logObj.type]
    logger(logObj.args)
  }
}

const appLoggerInstance = new AppLogger()

export const createAppLogger = (): Logger => {
  return consola.create({
    reporters: [appLoggerInstance],
    level: LogLevel.Error,
  })
}

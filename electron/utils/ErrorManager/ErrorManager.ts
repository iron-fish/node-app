import { app } from 'electron'
import parsers from './parsers'
import IErrorManager from 'Types/ErrorManagerTypes'
import sendMessageToRender from '../sendMessageToRender'
import EventType from 'Types/EventType'
class ErrorManager implements IErrorManager {
  private errors: Error[] = []

  private parseError(error: Error) {
    for (const parser of parsers) {
      const parsedError = parser(error)
      if (parsedError.isParsed) {
        return parsedError.error
      }
    }
    return error
  }

  async addError(error: Error): Promise<void> {
    this.errors.push(this.parseError(error))
    sendMessageToRender(EventType.CRITICAL_ERROR, this.errors)
  }

  async getErrors(): Promise<Error[]> {
    return this.errors
  }

  async processError(closeOnLastProcessed = true): Promise<Error[]> {
    this.errors = []
    if (closeOnLastProcessed) {
      app.quit()
    }
    return this.errors
  }
}

const errorManager = new ErrorManager()

export default errorManager

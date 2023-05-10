import { app } from 'electron'
import parsers from './parsers'

class ErrorManager {
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

  addError(error: Error) {
    this.errors.push(this.parseError(error))
  }

  getErrors(): Error[] {
    return this.errors
  }

  processError(index: number, closeOnLastProcessed = false) {
    this.errors.splice(index, 1)
    if (closeOnLastProcessed && this.errors.length === 0) {
      app.quit()
    }
    return this.errors
  }
}

const errorManager = new ErrorManager()

export default errorManager

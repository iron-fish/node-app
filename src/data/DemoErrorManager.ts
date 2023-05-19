import IErrorManager from 'Types/ErrorManagerTypes'
import EventType from 'Types/EventType'

class DemoErrorManager implements IErrorManager {
  private errors: Error[] = []

  constructor() {
    this.errors = []
  }

  async addError(error: Error): Promise<void> {
    this.errors.push(error)
    const event = new CustomEvent(EventType.CRITICAL_ERROR, {
      detail: [...this.errors],
    })
    document.dispatchEvent(event)
  }

  async getErrors(): Promise<Error[]> {
    return this.errors
  }

  async processError(closeOnLastProcessed = false): Promise<Error[]> {
    this.errors.pop()
    return [...this.errors]
  }
}

export default DemoErrorManager

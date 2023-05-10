import IErrorManager from 'Types/ErrorManagerTypes'

class DemoErrorManager implements IErrorManager {
  private errors: Error[] = []

  constructor() {
    this.errors = [
      new Error(
        "Can't create/find storage for local account details, please check write permissions for app installation directory"
      ),
      new Error(
        "Can't create/find local storage for address book, please check write permissions for app installation directory"
      ),
    ]
  }

  async addError(error: Error): Promise<void> {
    this.errors.push(error)
  }

  async getErrors(): Promise<Error[]> {
    return this.errors
  }

  async processError(
    index: number,
    closeOnLastProcessed = false
  ): Promise<Error[]> {
    this.errors.splice(index, 1)
    return [...this.errors]
  }
}

export default DemoErrorManager

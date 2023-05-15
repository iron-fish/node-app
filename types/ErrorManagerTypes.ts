export enum ErrorManagerActions {
  ADD_ERROR = 'addError',
  GET_ERRORS = 'getErrors',
  PROCESS_ERROR = 'processError',
}

interface IErrorManager {
  addError: (error: Error) => Promise<void>
  getErrors: () => Promise<Error[]>
  processError: (closeOnLastProcessed?: boolean) => Promise<Error[]>
}

export default IErrorManager

import IErrorManager, { ErrorManagerActions } from 'Types/ErrorManagerTypes'
import { invoke } from './util'

class ErrorManagerContext implements IErrorManager {
  addError = (error: Error) =>
    invoke('error-manager', ErrorManagerActions.ADD_ERROR, error)

  getErrors = () => invoke('error-manager', ErrorManagerActions.GET_ERRORS)

  processError = (closeOnLastProcessed: boolean) =>
    invoke(
      'error-manager',
      ErrorManagerActions.PROCESS_ERROR,
      closeOnLastProcessed
    )
}

export default new ErrorManagerContext()

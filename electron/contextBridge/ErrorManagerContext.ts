import { ipcRenderer } from 'electron'
import IErrorManager, { ErrorManagerActions } from 'Types/ErrorManagerTypes'

class ErrorManagerContext implements IErrorManager {
  addError = (error: Error) =>
    ipcRenderer.invoke('error-manager', ErrorManagerActions.ADD_ERROR, error)

  getErrors = () =>
    ipcRenderer.invoke('error-manager', ErrorManagerActions.GET_ERRORS)

  processError = (errorIndex: number, closeOnLastProcessed: boolean) =>
    ipcRenderer.invoke(
      'error-manager',
      ErrorManagerActions.PROCESS_ERROR,
      errorIndex,
      closeOnLastProcessed
    )
}

export default new ErrorManagerContext()

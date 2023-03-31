import { ipcRenderer } from 'electron'
import {
  IUpdateManager,
  ReleaseNote,
  UpdateManagerAction,
  UpdateStatus,
} from 'Types/IUpdateManager'

class UpdateManagerContext implements IUpdateManager {
  initialize: () => Promise<void> = () => {
    return ipcRenderer.invoke('update-manager', UpdateManagerAction.INITIALIZE)
  }
  checkUpdates: () => Promise<UpdateStatus> = () => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.CHECK_UPDATES
    )
  }
  ignoreUpdates: () => Promise<UpdateStatus> = () => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.IGNORE_UPDATES
    )
  }
  resetError: () => Promise<UpdateStatus> = () => {
    return ipcRenderer.invoke('update-manager', UpdateManagerAction.RESET_ERROR)
  }
  installUpdates: () => Promise<void> = () => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.INSTALL_UPDATES
    )
  }
  notes: () => Promise<ReleaseNote[]> = () => {
    return ipcRenderer.invoke('update-manager', UpdateManagerAction.NOTES)
  }
  note: (version: string) => Promise<ReleaseNote> = (version: string) => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.NOTE,
      version
    )
  }
}

export default new UpdateManagerContext()

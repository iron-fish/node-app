import { ipcRenderer } from 'electron'
import {
  IUpdateManager,
  ReleaseNote,
  UpdateManagerAction,
  UpdateReleaseNotesResponse,
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
  notes: (
    after?: string,
    limit?: number
  ) => Promise<UpdateReleaseNotesResponse> = (
    after?: string,
    limit?: number
  ) => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.NOTES,
      after,
      limit
    )
  }
  note: (version: string) => Promise<ReleaseNote> = (version: string) => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.NOTE,
      version
    )
  }
  getNewVersions: () => Promise<string[]> = () => {
    return ipcRenderer.invoke(
      'update-manager',
      UpdateManagerAction.GET_VERSIONS_BEFORE
    )
  }
}

export default new UpdateManagerContext()

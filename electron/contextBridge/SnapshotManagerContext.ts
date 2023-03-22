import { ipcRenderer } from 'electron'
import {
  IIronfishSnapshotManager,
  IronfishSnaphotManagerAction,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'

class SnapshotManagerContext implements IIronfishSnapshotManager {
  checkPath = (manifest: SnapshotManifest, pathToSave?: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.CHECK_PATH,
      manifest,
      pathToSave
    )
  }
  start = (pathToSave?: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.START,
      pathToSave
    )
  }
  apply = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.APPLY
    )
  }
  retry = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.RETRY
    )
  }
  manifest = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.MANIFEST
    )
  }
  reset = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.RESET
    )
  }
  status = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.STATUS
    )
  }
}

export default new SnapshotManagerContext()

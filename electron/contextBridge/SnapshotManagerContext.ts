import {
  IIronfishSnapshotManager,
  IronfishSnaphotManagerAction,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'
import { invoke } from './util'

class SnapshotManagerContext implements IIronfishSnapshotManager {
  checkPath = (manifest: SnapshotManifest, pathToSave?: string) => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.CHECK_PATH,
      manifest,
      pathToSave
    )
  }
  start = (pathToSave?: string) => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.START,
      pathToSave
    )
  }
  apply = () => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.APPLY
    )
  }
  decline = () => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.DECLINE
    )
  }
  retry = () => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.RETRY
    )
  }
  manifest = () => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.MANIFEST
    )
  }
  reset = () => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.RESET
    )
  }
  status = () => {
    return invoke(
      'ironfish-manager-snapshot',
      IronfishSnaphotManagerAction.STATUS
    )
  }
}

export default new SnapshotManagerContext()

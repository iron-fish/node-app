import { ConfigOptions } from '@ironfish/sdk'
import { ipcRenderer } from 'electron'
import IIronfishManager, {
  IronfishManagerAction,
} from 'Types/IronfishManager/IIronfishManager'
import AccountManagerContext from './AccountManagerContext'
import AssetManagerContext from './AssetManagerContext'
import NodeSettingsManagerContext from './NodeSettingsManagerContext'
import TransactionManagerContext from './TransactionManagerContext'
import SnapshotManagerContext from './SnapshotManagerContext'

class IronfishManagerContext implements IIronfishManager {
  accounts = AccountManagerContext
  transactions = TransactionManagerContext
  snapshot = SnapshotManagerContext
  assets = AssetManagerContext
  nodeSettings = NodeSettingsManagerContext

  initialize = () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.INITIALIZE)
  hasAnyAccount = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.HAS_ANY_ACCOUNT
    )
  }
  start = () => {
    return ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.START)
  }
  stop = (changeStatus?: boolean) => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.STOP,
      changeStatus
    )
  }
  status = () => {
    return ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.STATUS)
  }
  sync = () => {
    return ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.SYNC)
  }
  stopSyncing = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.STOP_SYNCING
    )
  }
  chainProgress = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.CHAIN_PROGRESS
    )
  }
  downloadChainSnapshot = (path?: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.DOWNLOAD_SNAPSHOT,
      path
    )
  }
  dump = (errors: Error[]) => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.DUMP,
      errors
    )
  }
  nodeStatus = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.NODE_STATUS
    )
  }
  peers = () => {
    return ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.PEERS)
  }
  getNodeConfig = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.GET_NODE_CONFIG
    )
  }
  saveNodeConfig = (values: Partial<ConfigOptions>) => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.SAVE_NODE_CONFIG,
      values
    )
  }
}

export default new IronfishManagerContext()

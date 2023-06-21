import { ConfigOptions, InternalOptions } from '@ironfish/sdk'
import IIronfishManager, {
  IronfishManagerAction,
} from 'Types/IronfishManager/IIronfishManager'
import AccountManagerContext from './AccountManagerContext'
import AssetManagerContext from './AssetManagerContext'
import NodeSettingsManagerContext from './NodeSettingsManagerContext'
import TransactionManagerContext from './TransactionManagerContext'
import SnapshotManagerContext from './SnapshotManagerContext'
import { invoke } from './util'

class IronfishManagerContext implements IIronfishManager {
  accounts = AccountManagerContext
  transactions = TransactionManagerContext
  snapshot = SnapshotManagerContext
  assets = AssetManagerContext
  nodeSettings = NodeSettingsManagerContext

  initialize = () =>
    invoke('ironfish-manager', IronfishManagerAction.INITIALIZE)
  isFirstRun = () =>
    invoke('ironfish-manager', IronfishManagerAction.IS_FIRST_RUN)
  hasAnyAccount = () => {
    return invoke('ironfish-manager', IronfishManagerAction.HAS_ANY_ACCOUNT)
  }
  start = () => {
    return invoke('ironfish-manager', IronfishManagerAction.START)
  }
  stop = (changeStatus?: boolean) => {
    return invoke('ironfish-manager', IronfishManagerAction.STOP, changeStatus)
  }
  status = () => {
    return invoke('ironfish-manager', IronfishManagerAction.STATUS)
  }
  sync = () => {
    return invoke('ironfish-manager', IronfishManagerAction.SYNC)
  }
  stopSyncing = () => {
    return invoke('ironfish-manager', IronfishManagerAction.STOP_SYNCING)
  }
  chainProgress = () => {
    return invoke('ironfish-manager', IronfishManagerAction.CHAIN_PROGRESS)
  }
  downloadChainSnapshot = (path?: string) => {
    return invoke(
      'ironfish-manager',
      IronfishManagerAction.DOWNLOAD_SNAPSHOT,
      path
    )
  }
  dump = (errors: Error[]) => {
    return invoke('ironfish-manager', IronfishManagerAction.DUMP, errors)
  }
  nodeStatus = () => {
    return invoke('ironfish-manager', IronfishManagerAction.NODE_STATUS)
  }
  peers = () => {
    return invoke('ironfish-manager', IronfishManagerAction.PEERS)
  }
  getNodeConfig = () => {
    return invoke('ironfish-manager', IronfishManagerAction.GET_NODE_CONFIG)
  }
  saveNodeConfig = (values: Partial<ConfigOptions>) => {
    return invoke(
      'ironfish-manager',
      IronfishManagerAction.SAVE_NODE_CONFIG,
      values
    )
  }
  getInternalConfig = <T extends keyof InternalOptions>(
    option: T
  ): Promise<InternalOptions[T]> => {
    return invoke(
      'ironfish-manager',
      IronfishManagerAction.GET_INTERNAL_CONFIG,
      option
    )
  }
  resetNode = () => {
    return invoke('ironfish-manager', IronfishManagerAction.RESET_NODE)
  }
  restartApp = () => {
    return invoke('ironfish-manager', IronfishManagerAction.RESTART_APP)
  }

  openLink = (url: string) => {
    return invoke('ironfish-manager', IronfishManagerAction.OPEN_LINK, url)
  }
}

export default new IronfishManagerContext()

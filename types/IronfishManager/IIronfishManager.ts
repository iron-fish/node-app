import { ConfigOptions, InternalOptions } from '@ironfish/sdk'
import IronFishInitStatus from '../IronfishInitStatus'
import NodeStatusResponse from 'Types/NodeStatusResponse'

import { IIronfishAccountManager } from './IIronfishAccountManager'
import { IIronfishTransactionManager } from './IIronfishTransactionManager'
import IIronfishAssetManager from './IIronfishAssetManager'
import { INodeSettingsManager } from './INodeSettingsManager'
import Peer from 'Types/Peer'
import { IIronfishSnapshotManager } from './IIronfishSnapshotManager'

export enum IronfishManagerAction {
  CHAIN_PROGRESS = 'chainProgress',
  DOWNLOAD_SNAPSHOT = 'downloadChainSnapshot',
  DUMP = 'dump',
  GET_NODE_CONFIG = 'getNodeConfig',
  HAS_ANY_ACCOUNT = 'hasAnyAccount',
  INITIALIZE = 'initialize',
  IS_FIRST_RUN = 'isFirstRun',
  NODE_STATUS = 'nodeStatus',
  PEERS = 'peers',
  SAVE_NODE_CONFIG = 'saveNodeConfig',
  GET_INTERNAL_CONFIG = 'getInternalConfig',
  START = 'start',
  STATUS = 'status',
  STOP = 'stop',
  STOP_SYNCING = 'stopSyncing',
  SYNC = 'sync',
}

export interface IIronfishManager {
  accounts: IIronfishAccountManager
  assets: IIronfishAssetManager
  nodeSettings: INodeSettingsManager
  snapshot: IIronfishSnapshotManager
  transactions: IIronfishTransactionManager

  chainProgress: () => Promise<number>
  downloadChainSnapshot: (path?: string) => Promise<void>
  dump: (errors: Error[]) => Promise<string>
  getNodeConfig: () => Promise<Partial<ConfigOptions>>
  hasAnyAccount: () => Promise<boolean>
  initialize: () => Promise<void>
  isFirstRun: () => Promise<boolean>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<Peer[]>
  saveNodeConfig: (values: Partial<ConfigOptions>) => Promise<void>
  start: () => Promise<void>
  status: () => Promise<IronFishInitStatus>
  stop: (changeStatus?: boolean) => Promise<void>
  stopSyncing: () => Promise<void>
  sync: () => Promise<void>
  getInternalConfig<T extends keyof InternalOptions>(
    option: T
  ): Promise<InternalOptions[T]>
}

export default IIronfishManager

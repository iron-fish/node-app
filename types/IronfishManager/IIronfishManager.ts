import { ConfigOptions } from '@ironfish/sdk'
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
  GET_NODE_CONFIG = 'getNodeConfig',
  HAS_ANY_ACCOUNT = 'hasAnyAccount',
  INITIALIZE = 'initialize',
  NODE_STATUS = 'nodeStatus',
  PEERS = 'peers',
  SAVE_NODE_CONFIG = 'saveNodeConfig',
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
  getNodeConfig: () => Promise<Partial<ConfigOptions>>
  hasAnyAccount: () => Promise<boolean>
  initialize: () => Promise<void>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<Peer[]>
  saveNodeConfig: (values: Partial<ConfigOptions>) => Promise<void>
  start: () => Promise<void>
  status: () => Promise<IronFishInitStatus>
  stop: (changeStatus?: boolean) => Promise<void>
  stopSyncing: () => Promise<void>
  sync: () => Promise<void>
}

export default IIronfishManager

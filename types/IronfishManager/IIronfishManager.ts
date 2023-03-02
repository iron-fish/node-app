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
  INITIALIZE = 'initialize',
  START = 'start',
  STOP = 'stop',
  STATUS = 'status',
  NODE_STATUS = 'nodeStatus',
  PEERS = 'peers',
  HAS_ANY_ACCOUNT = 'hasAnyAccount',
  CHAIN_PROGRESS = 'chainProgress',
  DOWNLOAD_SNAPSHOT = 'downloadChainSnapshot',
  SYNC = 'sync',
  STOP_SYNCING = 'stopSyncing',
  GET_NODE_CONFIG = 'getNodeConfig',
  SAVE_NODE_CONFIG = 'saveNodeConfig',
}

export interface IIronfishManager {
  accounts: IIronfishAccountManager
  transactions: IIronfishTransactionManager
  snapshot: IIronfishSnapshotManager
  assets: IIronfishAssetManager
  nodeSettings: INodeSettingsManager
  initialize: () => Promise<void>
  hasAnyAccount: () => Promise<boolean>
  start: () => Promise<void>
  stop: (changeStatus?: boolean) => Promise<void>
  status: () => Promise<IronFishInitStatus>
  sync: () => Promise<void>
  stopSyncing: () => Promise<void>
  chainProgress: () => Promise<number>
  downloadChainSnapshot: (path?: string) => Promise<void>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<Peer[]>
  getNodeConfig: () => Promise<Partial<ConfigOptions>>
  saveNodeConfig: (values: Partial<ConfigOptions>) => Promise<void>
}

export default IIronfishManager

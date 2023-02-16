import IronFishInitStatus from '../IronfishInitStatus'
import NodeStatusResponse from 'Types/NodeStatusResponse'

import { IIronfishAccountManager } from './IIronfishAccountManager'
import { IIronfishTransactionManager } from './IIronfishTransactionManager'
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
}

export interface IIronfishManager {
  accounts: IIronfishAccountManager
  transactions: IIronfishTransactionManager
  snapshot: IIronfishSnapshotManager
  initialize: () => Promise<void>
  hasAnyAccount: () => Promise<boolean>
  start: () => Promise<void>
  stop: () => Promise<void>
  status: () => Promise<IronFishInitStatus>
  sync: () => Promise<void>
  chainProgress: () => Promise<number>
  downloadChainSnapshot: (path: string) => Promise<void>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<Peer[]>
}

export default IIronfishManager

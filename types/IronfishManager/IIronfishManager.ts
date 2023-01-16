import { PeerResponse } from '@ironfish/sdk'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import IronFishInitStatus from '../IronfishInitStatus'

import { IIronfishAccountManager } from './IIronfishAccountManager'
import { IIronfishSnapshotManager } from './IIronfishSnapshotManager'
import { IIronfishTransactionManager } from './IIronfishTransactionManager'

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
  nodeStatus: () => Promise<NodeStatusResponse>
  downloadChainSnapshot: (path: string) => Promise<void>
  peers: () => Promise<PeerResponse[]>
}

export default IIronfishManager

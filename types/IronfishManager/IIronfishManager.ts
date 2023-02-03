import { PeerResponse, ConfigOptions } from '@ironfish/sdk'
import IronFishInitStatus from '../IronfishInitStatus'
import NodeStatusResponse from 'Types/NodeStatusResponse'

import { IIronfishAccountManager } from './IIronfishAccountManager'
import { IIronfishTransactionManager } from './IIronfishTransactionManager'
import { INodeSettingsManager } from './INodeSettingsManager'

export enum IronfishManagerAction {
  INITIALIZE = 'initialize',
  START = 'start',
  STOP = 'stop',
  STATUS = 'status',
  NODE_STATUS = 'nodeStatus',
  PEERS = 'peers',
  HAS_ANY_ACCOUNT = 'hasAnyAccount',
  SYNC = 'sync',
  GET_NODE_CONFIG = 'getNodeConfig',
  SAVE_NODE_CONFIG = 'saveNodeConfig',
}

export interface IIronfishManager {
  accounts: IIronfishAccountManager
  transactions: IIronfishTransactionManager
  nodeSettings: INodeSettingsManager
  initialize: () => Promise<void>
  hasAnyAccount: () => Promise<boolean>
  start: () => Promise<void>
  stop: () => Promise<void>
  status: () => Promise<IronFishInitStatus>
  sync: () => Promise<void>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<PeerResponse[]>
  getNodeConfig: () => Promise<Partial<ConfigOptions>>
  saveNodeConfig: (values: Partial<ConfigOptions>) => Promise<void>
}

export default IIronfishManager

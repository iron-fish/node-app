import { AccountValue, PeerResponse } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'
import CutAccount from './CutAccount'
import IronFishInitStatus from './IronfishInitStatus'
import NodeStatusResponse from 'Types/NodeStatusResponse'

export type IronfishManagerAction =
  | 'initialize'
  | 'start'
  | 'stop'
  | 'status'
  | 'nodeStatus'
  | 'peers'
  | 'hasAnyAccount'

export type IronfishAccountManagerAction =
  | 'create'
  | 'list'
  | 'get'
  | 'delete'
  | 'balance'
  | 'import'
  | 'export'

export type IronfishNodeStatusManagerAction = 'get' | 'getPeers'

export interface IIronfishAccountManager {
  create: (name: string) => Promise<AccountValue>
  list: (search?: string) => Promise<CutAccount[]>
  get: (id: string) => Promise<AccountValue>
  delete: (name: string) => Promise<void>
  import: (account: Omit<AccountValue, 'id'>) => Promise<AccountValue>
  export: (id: string) => Promise<AccountValue>
  balance: (id: string) => Promise<AccountBalance>
}

export interface IIronfishManager {
  accounts: IIronfishAccountManager
  initialize: () => Promise<void>
  hasAnyAccount: () => Promise<boolean>
  start: () => Promise<void>
  stop: () => Promise<void>
  status: () => Promise<IronFishInitStatus>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<PeerResponse[]>
}

export default IIronfishManager

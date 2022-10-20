import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'
import CutAccount from './CutAccount'
import IronFishInitStatus from './IronfishInitStatus'

export type IronfishManagerAction =
  | 'initialize'
  | 'start'
  | 'stop'
  | 'status'
  | 'hasAnyAccount'

export type IronfishAccountManagerAction =
  | 'create'
  | 'list'
  | 'get'
  | 'delete'
  | 'import'
  | 'export'

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
}

export default IIronfishManager

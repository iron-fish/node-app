import { AccountValue } from '@ironfish/sdk'
import Account from '../Account'
import AccountBalance from '../AccountBalance'
import CutAccount from '../CutAccount'
import SortType from '../SortType'

export enum IronfishAccountManagerAction {
  CREATE = 'create',
  LIST = 'list',
  GET = 'get',
  DELETE = 'delete',
  BALANCE = 'balance',
  IMPORT = 'import',
  EXPORT = 'export',
}

export interface IIronfishAccountManager {
  create: (name: string) => Promise<Account>
  list: (search?: string, sort?: SortType) => Promise<CutAccount[]>
  get: (id: string) => Promise<Account>
  delete: (name: string) => Promise<void>
  import: (account: Omit<AccountValue, 'id'>) => Promise<AccountValue>
  export: (id: string) => Promise<Omit<AccountValue, 'id'>>
  balance: (id: string) => Promise<AccountBalance>
}

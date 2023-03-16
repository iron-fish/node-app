import { AccountValue } from '@ironfish/sdk'
import AccountCreateParams from 'Types/AccountCreateParams'
import Account from '../Account'
import AccountBalance from '../AccountBalance'
import CutAccount from '../CutAccount'
import SortType from '../SortType'

export enum IronfishAccountManagerAction {
  CREATE = 'create',
  PREPARE_ACCOUNT = 'prepareAccount',
  SUBMIT_ACCOUNT = 'submitAccount',
  LIST = 'list',
  GET = 'get',
  DELETE = 'delete',
  BALANCE = 'balance',
  BALANCES = 'balances',
  IMPORT = 'import',
  EXPORT = 'export',
  GET_MNEMONIC_PHRASE = 'getMnemonicPhrase',
}

export interface IIronfishAccountManager {
  create: (name: string) => Promise<Account>
  prepareAccount: () => Promise<AccountCreateParams>
  submitAccount: (createParams: AccountValue) => Promise<Account>
  list: (search?: string, sort?: SortType) => Promise<CutAccount[]>
  get: (id: string) => Promise<Account>
  delete: (name: string) => Promise<void>
  import: (account: Omit<AccountValue, 'rescan'>) => Promise<AccountValue>
  export: (id: string) => Promise<AccountValue>
  balance: (id: string, assetId?: string) => Promise<AccountBalance>
  balances: (id: string) => Promise<{
    default: AccountBalance
    assets: AccountBalance[]
  }>
  getMnemonicPhrase: (id: string) => Promise<string[]>
}

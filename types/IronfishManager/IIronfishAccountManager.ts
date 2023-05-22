import {
  AccountValue,
  CreateAccountResponse,
  ImportResponse,
} from '@ironfish/sdk'
import AccountCreateParams from 'Types/AccountCreateParams'
import Account from '../Account'
import AccountBalance from '../AccountBalance'
import CutAccount from '../CutAccount'
import SortType from '../SortType'

export enum IronfishAccountManagerAction {
  BALANCE = 'balance',
  BALANCES = 'balances',
  CREATE = 'create',
  DELETE = 'delete',
  EXPORT = 'export',
  GET = 'get',
  GET_MNEMONIC_PHRASE = 'getMnemonicPhrase',
  IMPORT = 'import',
  IMPORT_BY_ENCODED_KEY = 'importByEncodedKey',
  IMPORT_BY_MNEMONIC = 'importByMnemonic',
  IS_VALID_PUBLIC_ADDRESS = 'isValidPublicAddress',
  LIST = 'list',
  PREPARE_ACCOUNT = 'prepareAccount',
  SUBMIT_ACCOUNT = 'submitAccount',
}

export interface IIronfishAccountManager {
  balance: (id: string, assetId?: string) => Promise<AccountBalance>
  balances: (id: string) => Promise<{
    default: AccountBalance
    assets: AccountBalance[]
  }>
  delete: (name: string) => Promise<void>
  export: (id: string, encoded?: boolean, viewOnly?: boolean) => Promise<string>
  get: (id: string) => Promise<Account>
  getMnemonicPhrase: (id: string) => Promise<string[]>
  import: (account: Omit<AccountValue, 'rescan'>) => Promise<AccountValue>
  importByEncodedKey: (data: string) => Promise<AccountValue>
  importByMnemonic: (name: string, mnemonic: string) => Promise<AccountValue>
  isValidPublicAddress: (address: string) => Promise<boolean>
  list: (search?: string, sort?: SortType) => Promise<CutAccount[]>
  prepareAccount: () => Promise<AccountCreateParams>
  submitAccount: (createParams: AccountValue) => Promise<ImportResponse>
}

import { AccountValue } from '@ironfish/sdk'
import {
  IIronfishAccountManager,
  IronfishAccountManagerAction,
} from 'Types/IronfishManager/IIronfishAccountManager'
import SortType from 'Types/SortType'
import { invoke } from './util'

class AccountManagerContext implements IIronfishAccountManager {
  importByEncodedKey = (data: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IMPORT_BY_ENCODED_KEY,
      data
    )
  }
  importByMnemonic = (name: string, mnemonic: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IMPORT_BY_MNEMONIC,
      name,
      mnemonic
    )
  }
  create = (name: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.CREATE,
      name
    )
  }
  prepareAccount = () => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.PREPARE_ACCOUNT
    )
  }
  submitAccount = (createParams: AccountValue) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.SUBMIT_ACCOUNT,
      createParams
    )
  }
  list = (search?: string, sort?: SortType) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.LIST,
      search,
      sort
    )
  }
  get = (id: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.GET,
      id
    )
  }
  delete = (name: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.DELETE,
      name
    )
  }
  import = (account: Omit<AccountValue, 'rescan'>) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IMPORT,
      account
    )
  }
  isValidPublicAddress = (address: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IS_VALID_PUBLIC_ADDRESS,
      address
    )
  }
  export = (id: string, encode?: boolean, viewOnly?: boolean) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.EXPORT,
      id,
      encode,
      viewOnly
    )
  }
  balance = (id: string, assetId?: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.BALANCE,
      id,
      assetId
    )
  }
  balances = (id: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.BALANCES,
      id
    )
  }
  getMnemonicPhrase = (id: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.GET_MNEMONIC_PHRASE,
      id
    )
  }
  renameAccount = (id: string, name: string) => {
    return invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.RENAME_ACCOUNT,
      id,
      name
    )
  }
}

export default new AccountManagerContext()

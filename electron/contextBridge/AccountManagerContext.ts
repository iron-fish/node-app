import { AccountValue } from '@ironfish/sdk'
import { ipcRenderer } from 'electron'
import {
  IIronfishAccountManager,
  IronfishAccountManagerAction,
} from 'Types/IronfishManager/IIronfishAccountManager'
import SortType from 'Types/SortType'

class AccountManagerContext implements IIronfishAccountManager {
  importByEncodedKey = (data: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IMPORT_BY_ENCODED_KEY,
      data
    )
  }
  importByMnemonic = (name: string, mnemonic: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IMPORT_BY_MNEMONIC,
      name,
      mnemonic
    )
  }
  create = (name: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.CREATE,
      name
    )
  }
  prepareAccount = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.PREPARE_ACCOUNT
    )
  }
  submitAccount = (createParams: AccountValue) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.SUBMIT_ACCOUNT,
      createParams
    )
  }
  list = (search?: string, sort?: SortType) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.LIST,
      search,
      sort
    )
  }
  get = (id: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.GET,
      id
    )
  }
  delete = (name: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.DELETE,
      name
    )
  }
  import = (account: Omit<AccountValue, 'rescan'>) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IMPORT,
      account
    )
  }
  isValidPublicAddress = (address: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.IS_VALID_PUBLIC_ADDRESS,
      address
    )
  }
  export = (id: string, encode?: boolean, viewOnly?: boolean) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.EXPORT,
      id,
      encode,
      viewOnly
    )
  }
  balance = (id: string, assetId?: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.BALANCE,
      id,
      assetId
    )
  }
  balances = (id: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.BALANCES,
      id
    )
  }
  getMnemonicPhrase = (id: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-accounts',
      IronfishAccountManagerAction.GET_MNEMONIC_PHRASE,
      id
    )
  }
}

export default new AccountManagerContext()

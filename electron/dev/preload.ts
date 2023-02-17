import { contextBridge, ipcRenderer } from 'electron'
import { AccountValue, ConfigOptions } from '@ironfish/sdk'

import SortType from 'Types/SortType'
import IStorage from 'Types/IStorage'
import Entity from 'Types/Entity'
import {
  IIronfishManager,
  IronfishManagerAction,
} from 'Types/IronfishManager/IIronfishManager'
import { IronfishTransactionManagerAction } from 'Types/IronfishManager/IIronfishTransactionManager'
import { IronfishAccountManagerAction } from 'Types/IronfishManager/IIronfishAccountManager'
import { Payment } from 'Types/Transaction'
import '../common/preload'
import AccountCreateParams from 'Types/AccountCreateParams'

function wrapMethodsWithCallbacks<T extends Entity>(
  storageName: string
): IStorage<T> {
  return {
    list: (searchTerm: string, sort: SortType) =>
      ipcRenderer.invoke(storageName + '-list', searchTerm, sort),
    get: (identity: string) =>
      ipcRenderer.invoke(storageName + '-get', identity),
    add: (contact: Omit<T, '_id'>) =>
      ipcRenderer.invoke(storageName + '-add', contact),
    update: (identity: string, fieldsToUpdate: Partial<Omit<T, '_id'>>) =>
      ipcRenderer.invoke(storageName + '-update', identity, fieldsToUpdate),
    delete: (identity: string) =>
      ipcRenderer.invoke(storageName + '-delete', identity),
    find: (fields: Partial<Omit<T, '_id'>>) =>
      ipcRenderer.invoke(storageName + '-find', fields),
  }
}

contextBridge.exposeInMainWorld('IronfishManager', {
  status: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.STATUS),
  initialize: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.INITIALIZE),
  hasAnyAccount: () =>
    ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.HAS_ANY_ACCOUNT
    ),
  start: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.START),
  stop: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.STOP),
  nodeStatus: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.NODE_STATUS),
  sync: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.SYNC),
  peers: () =>
    ipcRenderer.invoke('ironfish-manager', IronfishManagerAction.PEERS),
  getNodeConfig: () =>
    ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.GET_NODE_CONFIG
    ),
  saveNodeConfig: (values: Partial<ConfigOptions>) =>
    ipcRenderer.invoke(
      'ironfish-manager',
      IronfishManagerAction.SAVE_NODE_CONFIG,
      values
    ),
  accounts: {
    create: (name: string) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.CREATE,
        name
      ),
    prepareAccount: () =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.PREPARE_ACCOUNT
      ),
    submitAccount: (createParams: AccountCreateParams) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.SUBMIT_ACCOUNT,
        createParams
      ),
    list: (search?: string, sort?: SortType) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.LIST,
        search,
        sort
      ),
    get: (id: string) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.GET,
        id
      ),
    delete: (name: string) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.DELETE,
        name
      ),
    import: (account: Omit<AccountValue, 'id' | 'rescan'>) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.IMPORT,
        account
      ),
    export: (id: string) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.EXPORT,
        id
      ),
    balance: (id: string) =>
      ipcRenderer.invoke(
        'ironfish-manager-accounts',
        IronfishAccountManagerAction.BALANCE,
        id
      ),
  },
  transactions: {
    get: (hash: string, accountId: string) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.GET,
        hash,
        accountId
      ),
    send: (accountId: string, payment: Payment, transactionFee?: bigint) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.SEND,
        accountId,
        payment,
        transactionFee
      ),
    fees: (numOfBlocks = 100) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.FEES,
        numOfBlocks
      ),
    averageFee: (numOfBlocks = 100) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.AVERAGE_FEE,
        numOfBlocks
      ),
    estimateFeeWithPriority: (accountId: string, receive: Payment) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.ESTIMATE_FEE,
        accountId,
        receive
      ),
    findByAccountId: (
      accountId: string,
      searchTerm?: string,
      sort?: SortType
    ) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.FIND_BY_ACCOUNT_ID,
        accountId,
        searchTerm,
        sort
      ),
    findByAddress: (address: string, searchTerm?: string, sort?: SortType) =>
      ipcRenderer.invoke(
        'ironfish-manager-transactions',
        IronfishTransactionManagerAction.FIND_BY_ADDRESS,
        address,
        searchTerm,
        sort
      ),
  },
} as IIronfishManager)

contextBridge.exposeInMainWorld(
  'AddressBookStorage',
  wrapMethodsWithCallbacks('address-book')
)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  wrapMethodsWithCallbacks('account-settings')
)

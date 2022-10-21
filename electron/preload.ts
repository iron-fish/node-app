import { contextBridge, ipcRenderer } from 'electron'
// import { IronfishSdk } from '@ironfish/sdk'

// contextBridge.exposeInMainWorld('Wallet', IronfishSdk)
import SortType from 'Types/SortType'
import IStorage from 'Types/IStorage'
import Entity from 'Types/Entity'
import { AccountValue } from '@ironfish/sdk'
import IIronfishManager from 'Types/IIronfishManager'

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

// contextBridge.exposeInMainWorld('Wallet', IronfishSdk)
contextBridge.exposeInMainWorld(
  'setElectronThemeMode',
  (mode: 'light' | 'dark' | 'system') => {
    ipcRenderer.invoke('theme-mode-change', mode)
  }
)
contextBridge.exposeInMainWorld('IronfishManager', {
  status: () => ipcRenderer.invoke('ironfish-manager', 'status'),
  initialize: () => ipcRenderer.invoke('ironfish-manager', 'initialize'),
  hasAnyAccount: () => ipcRenderer.invoke('ironfish-manager', 'hasAnyAccount'),
  start: () => ipcRenderer.invoke('ironfish-manager', 'start'),
  stop: () => ipcRenderer.invoke('ironfish-manager', 'stop'),
  accounts: {
    create: (name: string) =>
      ipcRenderer.invoke('ironfish-manager-accounts', 'create', name),
    list: () => ipcRenderer.invoke('ironfish-manager-accounts', 'list'),
    get: (id: string) =>
      ipcRenderer.invoke('ironfish-manager-accounts', 'get', id),
    delete: (name: string) =>
      ipcRenderer.invoke('ironfish-manager-accounts', 'delete', name),
    import: (account: Omit<AccountValue, 'id' | 'rescan'>) =>
      ipcRenderer.invoke('ironfish-manager-accounts', 'import', account),
    export: (id: string) =>
      ipcRenderer.invoke('ironfish-manager-accounts', 'export', id),
    balance: (id: string) =>
      ipcRenderer.invoke('ironfish-manager-accounts', 'balance', id),
  },
  nodeStatus: {
    get: () => ipcRenderer.invoke('ironfish-manager-node-status', 'get'),
  },
})
contextBridge.exposeInMainWorld(
  'AddressBookStorage',
  wrapMethodsWithCallbacks('address-book')
)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  wrapMethodsWithCallbacks('account-settings')
)

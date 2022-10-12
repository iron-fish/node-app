import { contextBridge, ipcRenderer } from 'electron'
// import { IronfishSdk } from '@ironfish/sdk'

import SortType from 'Types/SortType'
import IStorage from 'Types/IStorage'
import Entity from 'Types/Entity'

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
  'AddressBookStorage',
  wrapMethodsWithCallbacks('address-book')
)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  wrapMethodsWithCallbacks('account-settings')
)

import { contextBridge, ipcRenderer } from 'electron'
// import { IronfishSdk } from '@ironfish/sdk'

import SortType from 'Types/SortType'
import IStorage from 'Types/IStorage'
import Entity from 'Types/Entity'

function wrapMethodsWithCallbacks<T extends Entity>(
  channelPrefix: string
): IStorage<T> {
  return {
    list: (searchTerm: string, sort: SortType) =>
      ipcRenderer.invoke(channelPrefix + '-list', searchTerm, sort),
    get: (identity: string) =>
      ipcRenderer.invoke(channelPrefix + '-get', identity),
    add: (contact: Omit<T, '_id'>) =>
      ipcRenderer.invoke(channelPrefix + '-add', contact),
    update: (identity: string, fieldsToUpdate: Partial<Omit<T, '_id'>>) =>
      ipcRenderer.invoke(channelPrefix + '-update', identity, fieldsToUpdate),
    delete: (identity: string) =>
      ipcRenderer.invoke(channelPrefix + '-delete', identity),
    find: (fields: Partial<Omit<T, '_id'>>) =>
      ipcRenderer.invoke(channelPrefix + '-find', fields),
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

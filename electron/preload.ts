import { contextBridge, ipcRenderer } from 'electron'
import { IronfishSdk } from '@ironfish/sdk'
import AddressBookStorage from './storage/AddressBookStorage'
import AccountSettingsStorage from './storage/AccountSettingsStorage'

import SortType from './storage/types/SortType'
import Contact from './storage/types/Contact'
import IStorage from './storage/types/IStorage'
import Entity from './storage/types/Entity'

function wrapMethodsWithCallbacks<T extends Entity>(
  storage: IStorage<T>
): IStorage<T> {
  return {
    list: (searchTerm: string, sort: SortType) =>
      storage.list(searchTerm, sort),
    get: (identity: string) => storage.get(identity),
    add: (contact: Omit<T, '_id'>) => storage.add(contact),
    update: (identity: string, fieldsToUpdate: Partial<Omit<T, '_id'>>) =>
      storage.update(identity, fieldsToUpdate),
    delete: (identity: string) => storage.delete(identity),
    find: (fields: Partial<Omit<T, '_id'>>) => storage.find(fields),
  }
}

const addressBookStorage = new AddressBookStorage()
const accountSettingsStorage = new AccountSettingsStorage()

contextBridge.exposeInMainWorld('Wallet', IronfishSdk)
contextBridge.exposeInMainWorld(
  'AddressBookStorage',
  wrapMethodsWithCallbacks(addressBookStorage)
)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  wrapMethodsWithCallbacks(accountSettingsStorage)
)

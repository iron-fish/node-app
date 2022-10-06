import { contextBridge, ipcRenderer } from 'electron'
import { IronfishSdk } from '@ironfish/sdk'
import AddressBookStorage from './storage/AddressBookStorage'
import SortType from './storage/types/SortType'
import Contact from './storage/types/Contact'

const addressBookStorage = new AddressBookStorage()

contextBridge.exposeInMainWorld('Wallet', IronfishSdk)
contextBridge.exposeInMainWorld('AddressBookStorage', {
  list: (searchTerm: string, sort: SortType) =>
    addressBookStorage.list(searchTerm, sort),
  add: (name: string, address: string) => addressBookStorage.add(name, address),
  update: (identity: string, fieldsToUpdate: Partial<Omit<Contact, '_id'>>) =>
    addressBookStorage.update(identity, fieldsToUpdate),
  delete: (identity: string) => addressBookStorage.delete(identity),
  find: (fields: Partial<Contact>) => addressBookStorage.find(fields),
})
contextBridge.exposeInMainWorld('setElectronThemeMode', mode => {
  ipcRenderer.invoke('theme-mode-change', mode)
})

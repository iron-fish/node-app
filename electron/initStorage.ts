import AddressBookStorage from './storage/AddressBookStorage'
import AccountSettingsStorage from './storage/AccountSettingsStorage'
import { IpcMain } from 'electron/main'
import AbstractStorage from './storage/AbstractStorage'

import SortType from 'Types/SortType'
import IStorage from 'Types/IStorage'
import Entity from 'Types/Entity'

const storages: Record<string, AbstractStorage<Entity>> = {
  'address-book': new AddressBookStorage(),
  'account-settings': new AccountSettingsStorage(),
}

function initStorageCallbacks(ipcMain: IpcMain) {
  Object.entries(storages).forEach(storage => {
    ipcMain.handle(storage[0] + '-list', (e, searchTerm, sort) =>
      storage[1].list(searchTerm, sort)
    )
    ipcMain.handle(storage[0] + '-get', (e, identity) =>
      storage[1].get(identity)
    )
    ipcMain.handle(storage[0] + '-add', (e, entity) => storage[1].add(entity))
    ipcMain.handle(storage[0] + '-update', (e, identity, entity) =>
      storage[1].update(identity, entity)
    )
    ipcMain.handle(storage[0] + '-delete', (e, identity) =>
      storage[1].delete(identity)
    )
    ipcMain.handle(storage[0] + '-find', (e, fields) => storage[1].find(fields))
  })
}

export default initStorageCallbacks

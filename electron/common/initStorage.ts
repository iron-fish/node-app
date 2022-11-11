import { IpcMain } from 'electron/main'
import AbstractStorage from '../storage/AbstractStorage'
import AccountSettingsStorage from '../storage/AccountSettingsStorage'
import AddressBookStorage from '../storage/AddressBookStorage'

import Entity from 'Types/Entity'

const storages: Record<string, AbstractStorage<Entity>> = {
  'address-book': new AddressBookStorage(),
  'account-settings': new AccountSettingsStorage(),
}

function initStorageCallbacks(ipcMain: IpcMain) {
  Object.entries(storages).forEach(([storageName, storage]) => {
    ipcMain.handle(storageName + '-list', (e, searchTerm, sort) =>
      storage.list(searchTerm, sort)
    )
    ipcMain.handle(storageName + '-get', (e, identity) => storage.get(identity))
    ipcMain.handle(storageName + '-add', (e, entity) => storage.add(entity))
    ipcMain.handle(storageName + '-update', (e, identity, entity) =>
      storage.update(identity, entity)
    )
    ipcMain.handle(storageName + '-delete', (e, identity) =>
      storage.delete(identity)
    )
    ipcMain.handle(storageName + '-find', (e, fields) => storage.find(fields))
  })
}

export default initStorageCallbacks

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
    ipcMain.handle(storageName + '-list', (_event, searchTerm, sort) =>
      storage.list(searchTerm, sort).catch(e => {
        if (e.message) {
          throw new Error(e.message)
        }
        throw e
      })
    )
    ipcMain.handle(storageName + '-get', (_event, identity) =>
      storage.get(identity).catch(e => {
        if (e.message) {
          throw new Error(e.message)
        }
        throw e
      })
    )
    ipcMain.handle(storageName + '-add', (_event, entity) =>
      storage.add(entity).catch(e => {
        if (e.message) {
          throw new Error(e.message)
        }
        throw e
      })
    )
    ipcMain.handle(storageName + '-update', (_event, identity, entity) =>
      storage.update(identity, entity).catch(e => {
        if (e.message) {
          throw new Error(e.message)
        }
        throw e
      })
    )
    ipcMain.handle(storageName + '-delete', (_event, identity) =>
      storage.delete(identity).catch(e => {
        if (e.message) {
          throw new Error(e.message)
        }
        throw e
      })
    )
    ipcMain.handle(storageName + '-find', (_event, fields) =>
      storage.find(fields).catch(e => {
        if (e.message) {
          throw new Error(e.message)
        }
        throw e
      })
    )
  })
}

export default initStorageCallbacks

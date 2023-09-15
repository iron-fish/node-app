import { IpcMain } from 'electron/main'
import AbstractStorage from '../storage/AbstractStorage'
import AccountSettingsStorage from '../storage/AccountSettingsStorage'
import AddressBookStorage from '../storage/AddressBookStorage'
import { handleError } from './initHandlers'

import Entity from 'Types/Entity'

const storages: Record<string, AbstractStorage<Entity>> = {
  'address-book': new AddressBookStorage(),
  'account-settings': new AccountSettingsStorage(),
}

function initStorageCallbacks(ipcMain: IpcMain) {
  Object.entries(storages).forEach(([storageName, storage]) => {
    ipcMain.handle(storageName + '-list', (e, searchTerm, sort) => {
      try {
        return { error: false, data: storage.list(searchTerm, sort) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-get', (e, identity) => {
      try {
        return { error: false, data: storage.get(identity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-add', (e, entity) => {
      try {
        return { error: false, data: storage.add(entity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-update', (e, identity, entity) => {
      try {
        return { error: false, data: storage.update(identity, entity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-delete', (e, identity) => {
      try {
        return { error: false, data: storage.delete(identity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-find', (e, fields) => {
      try {
        return { error: false, data: storage.find(fields) }
      } catch (error) {
        return handleError(error)
      }
    })
  })
}

export default initStorageCallbacks

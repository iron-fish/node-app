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
    ipcMain.handle(storageName + '-list', async (e, searchTerm, sort) => {
      try {
        return { error: false, data: await storage.list(searchTerm, sort) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-get', async (e, identity) => {
      try {
        return { error: false, data: await storage.get(identity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-add', async (e, entity) => {
      try {
        return { error: false, data: await storage.add(entity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-update', async (e, identity, entity) => {
      try {
        return { error: false, data: await storage.update(identity, entity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-delete', async (e, identity) => {
      try {
        return { error: false, data: await storage.delete(identity) }
      } catch (error) {
        return handleError(error)
      }
    })

    ipcMain.handle(storageName + '-find', async (e, fields) => {
      try {
        return { error: false, data: await storage.find(fields) }
      } catch (error) {
        return handleError(error)
      }
    })
  })
}

export default initStorageCallbacks

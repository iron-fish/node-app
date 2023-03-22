import IStorage from 'Types/IStorage'
import SortType from 'Types/SortType'
import Entity from 'Types/Entity'
import { ipcRenderer } from 'electron'

class StorageContext implements IStorage<Entity> {
  name: string

  constructor(name: string) {
    this.name = name
  }

  list = (searchTerm: string, sort: SortType) => {
    return ipcRenderer.invoke(this.name + '-list', searchTerm, sort)
  }
  get = (identity: string) => {
    return ipcRenderer.invoke(this.name + '-get', identity)
  }
  add = (entity: Omit<Entity, '_id'>) => {
    return ipcRenderer.invoke(this.name + '-add', entity)
  }
  update = (identity: string, fieldsToUpdate: Partial<Omit<Entity, '_id'>>) => {
    return ipcRenderer.invoke(this.name + '-update', identity, fieldsToUpdate)
  }
  delete = (identity: string) => {
    return ipcRenderer.invoke(this.name + '-delete', identity)
  }
  find = (entity: Partial<Omit<Entity, '_id'>>) => {
    return ipcRenderer.invoke(this.name + '-find', entity)
  }
}

export const AddressBookStorage = new StorageContext('address-book')
export const AccountSettingsStorage = new StorageContext('account-settings')

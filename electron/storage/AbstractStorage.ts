import NeDBStorage from 'nedb'
import Entity from 'Types/Entity'
import IStorage from 'Types/IStorage'
import SortType from 'Types/SortType'

abstract class AbstractStorage<T extends Entity> implements IStorage<T> {
  protected storage: Nedb

  constructor(
    storageOptions: Nedb.DataStoreOptions,
    indexes: Nedb.EnsureIndexOptions[]
  ) {
    this.storage = new NeDBStorage(storageOptions)
    indexes.forEach(opts => {
      this.storage.ensureIndex(opts)
    })
  }
  abstract list(searchTerm: string, sort: SortType): Promise<T[]>
  get(identity: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.storage.findOne({ _id: identity }, (err, entity) => {
        if (err) {
          reject(err)
        } else {
          resolve(entity)
        }
      })
    })
  }

  add(entity: Partial<Omit<T, '_id'>>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.storage.insert(entity, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result as T)
        }
      })
    })
  }

  update(
    identity: string,
    fieldsToUpdate: Partial<Omit<T, '_id'>>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.storage.update(
        { _id: identity },
        { $set: fieldsToUpdate },
        { returnUpdatedDocs: true, upsert: true },
        err => {
          if (err) {
            reject(err)
          } else {
            this.get(identity).then(res => resolve(res))
          }
        }
      )
    })
  }

  delete(identity: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.remove({ _id: identity }, {}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  find(entity: Partial<Omit<T, '_id'>>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.storage.findOne(
        {
          $or: Object.entries(entity).map(key_value => ({
            [key_value[0]]: key_value[1],
          })),
        },
        (err, contact) => {
          if (err) {
            reject(err)
          } else {
            resolve(contact)
          }
        }
      )
    })
  }
}

export default AbstractStorage

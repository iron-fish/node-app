import DataStore from 'nedb'
import AddressBookStorageProps from './types/AddressBookStorageProps'
import Contact from './types/Contact'
import SortType from './types/SortType'

class AddressBookStorage implements AddressBookStorageProps {
  private storage: Nedb

  constructor() {
    this.storage = new DataStore({
      filename: 'address_book.db',
      autoload: true,
      timestampData: true,
    })
    this.storage.ensureIndex({
      fieldName: 'address',
      unique: true,
    })
  }

  list(searchTerm: string, sort: SortType): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      this.storage
        .find({
          $or: [
            { name: new RegExp(searchTerm, 'g') },
            { address: new RegExp(searchTerm, 'g') },
          ],
        })
        .sort({ name: sort === SortType.DESC ? -1 : 1 })
        .exec((err, contacts) => {
          if (err) {
            reject(err)
          } else {
            resolve(contacts)
          }
        })
    })
  }

  add(name: string, address: string): Promise<Contact> {
    return new Promise((resolve, reject) => {
      const contact: Contact = {
        name: name,
        address: address,
      }
      this.storage.insert(contact, (err, document) => {
        if (err) {
          reject(err)
        } else {
          resolve(document)
        }
      })
    })
  }

  update(
    identity: string,
    fieldsToUpdate: Partial<Omit<Contact, '_id'>>
  ): Promise<Contact> {
    return new Promise((resolve, reject) => {
      this.storage.update(
        { _id: identity },
        { $set: fieldsToUpdate },
        { returnUpdatedDocs: true },
        err => {
          if (err) {
            reject(err)
          } else {
            this.storage.findOne({ _id: identity }, (error, contact) => {
              if (error) {
                reject(error)
              } else {
                resolve(contact)
              }
            })
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

  find(fields: Partial<Contact>): Promise<Contact> {
    return new Promise((resolve, reject) => {
      this.storage.findOne({ $or: fields }, (err, contact) => {
        if (err) {
          reject(err)
        } else {
          resolve(contact)
        }
      })
    })
  }
}

export default AddressBookStorage

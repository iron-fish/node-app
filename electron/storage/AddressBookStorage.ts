import AbstractStorage from './AbstractStorage'
import Contact from 'Types/Contact'
import SortType from 'Types/SortType'
import getAppHomeFolder from '../utils/getAppHomeFolder'

export const ADDRESS_BOOK_STORAGE_NAME = 'address_book.db'

class AddressBookStorage extends AbstractStorage<Contact> {
  constructor() {
    super(
      {
        filename: getAppHomeFolder('/', ADDRESS_BOOK_STORAGE_NAME),
        autoload: true,
        timestampData: true,
      },
      [
        {
          fieldName: 'address',
          unique: true,
        },
      ]
    )

    this.migrations()
  }

  private migrations() {
    this.storage.update(
      { order: { $exists: false } },
      { $set: { order: 0 } },
      { multi: true, returnUpdatedDocs: true }
    )

    let cnt = 1

    this.storage.find({ order: 0 }).exec((err, docs) => {
      docs.forEach(doc => {
        this.storage.update(doc, { $set: { order: cnt } })
        cnt++
      })
    })
  }

  getNextNumber(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.storage
        .find({})
        .sort({ order: -1 })
        .limit(1)
        .exec((err, docs) => {
          if (err) {
            reject(err)
          } else {
            resolve((docs.at(0)?.order || 0) + 1)
          }
        })
    })
  }

  list(searchTerm: string, sort: SortType): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      this.storage
        .find({
          $or: [
            { name: new RegExp(`${searchTerm}.*`, 'i') },
            { address: new RegExp(`${searchTerm}.*`, 'i') },
          ],
        })
        .sort({ createdAt: sort === SortType.DESC ? -1 : 1 })
        .exec((err, contacts) => {
          if (err) {
            reject(err)
          } else {
            resolve(contacts)
          }
        })
    })
  }

  async add(entity: Omit<Contact, '_id' | 'order'>): Promise<Contact> {
    const record = await this.find({ address: entity.address })
    if (record) {
      throw new Error(
        `Account with public address '${entity.address}' already exists`
      )
    }

    const order = await this.getNextNumber()
    const contact = await super.add({ ...entity, order: order })

    return contact
  }
}

export default AddressBookStorage

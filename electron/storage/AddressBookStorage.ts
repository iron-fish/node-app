import AbstractStorage from './AbstractStorage'
import Contact from 'Types/Contact'
import SortType from 'Types/SortType'

class AddressBookStorage extends AbstractStorage<Contact> {
  constructor() {
    super(
      {
        filename: 'address_book.db',
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
        .sort({ number: -1 })
        .limit(1)
        .exec((err, docs) => {
          if (err) {
            reject(err)
          } else {
            resolve((docs.at(0)?.number || 0) + 1)
          }
        })
    })
  }

  list(searchTerm: string, sort: SortType): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      this.storage
        .find({
          $or: [
            { name: new RegExp(`${searchTerm}.*`) },
            { address: new RegExp(`${searchTerm}.*`) },
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
    const order = await this.getNextNumber()
    const contact = await super.add({ ...entity, order: order })

    return contact
  }
}

export default AddressBookStorage

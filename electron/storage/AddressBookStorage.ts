import AbstractStorage from './AbstractStorage'
import Contact from './types/Contact'
import SortType from './types/SortType'

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
}

export default AddressBookStorage

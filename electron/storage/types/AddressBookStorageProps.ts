import Contact from './Contact'
import SortType from './SortType'

interface AddressBookStorageProps {
  list: (searchTerm: string, sort: SortType) => Promise<Contact[]>
  add: (name: string, address: string) => Promise<Contact>
  update: (
    identity: string,
    fieldsToUpdate: Partial<Omit<Contact, '_id'>>
  ) => Promise<Contact>
  delete: (identity: string) => Promise<void>
  find: (fields: Partial<Contact>) => Promise<Contact>
}

export default AddressBookStorageProps

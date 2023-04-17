import Contact from 'Types/Contact'
import { nanoid } from 'nanoid'
import SortType from 'Types/SortType'
import IStorage from 'Types/IStorage'

const DEMO_ADDRESS_BOOK: Contact[] = [
  {
    _id: '0',
    order: 1,
    name: 'Frankie Boy',
    address: 'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
  },
  {
    _id: '1',
    order: 2,
    name: 'Tweetie',
    address: 'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOi',
  },
  {
    _id: '2',
    order: 3,
    name: 'Rox1923',
    address: 'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
  },
  {
    _id: '3',
    order: 4,
    name: 'Alfred A',
    address: 'iL1ezH4hjVgM4DGz0Sm00lpUN7IiIAMU6SJQznZ2rUg-R5Cqtj7c7Um6zkwh2Dez',
  },
  {
    _id: '4',
    order: 5,
    name: 'Derek',
    address: '7C5NxoCyjt86wtEEHEF1d60omCsaH9tFO6Tf6Rn0jqowxowgbBtCoapcSxn0jrXN',
  },
  {
    _id: '5',
    order: 6,
    name: 'Jason',
    address: 'OSAblUtjE_cda1CD_baWcpiEWBM3qp0SnZXANluiM7G4psf7Z6ojb3nXFIFaQdBx',
  },
]

class DemoAddressBookManager implements IStorage<Contact> {
  list(searchTerm: string, sort?: SortType): Promise<Contact[]> {
    return new Promise(resolve => {
      const search = searchTerm?.toLowerCase()
      setTimeout(
        () =>
          resolve(
            DEMO_ADDRESS_BOOK.filter(
              contact =>
                contact.name.toLowerCase().includes(search || '') ||
                contact.address.toLowerCase().includes(search || '')
            ).sort(
              (a, b) =>
                a.name.localeCompare(b.name) * (sort === SortType.DESC ? -1 : 1)
            )
          ),
        500
      )
    })
  }

  get(identity: string): Promise<Contact> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(DEMO_ADDRESS_BOOK.find(contact => contact._id === identity))
      }, 500)
    })
  }

  find(entity: Partial<Omit<Contact, 'identity'>>): Promise<Contact> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          DEMO_ADDRESS_BOOK.find(
            contact =>
              contact.name
                .toLowerCase()
                .includes((entity.name || '').toLowerCase()) &&
              contact.address
                .toLowerCase()
                .includes((entity.address || '').toLowerCase())
          )
        )
      }, 500)
    })
  }

  add(entity: Partial<Omit<Contact, '_id'>>): Promise<Contact> {
    return new Promise(resolve => {
      setTimeout(() => {
        const contact = {
          _id: nanoid(64),
          address: entity.address,
          name: entity.name,
          order: DEMO_ADDRESS_BOOK.at(-1).order + 1,
        }
        DEMO_ADDRESS_BOOK.push(contact)
        resolve(contact)
      }, 500)
    })
  }

  update(
    identity: string,
    fieldsToUpdate: Partial<Omit<Contact, '_id'>>
  ): Promise<Contact> {
    return new Promise(resolve => {
      setTimeout(() => {
        const contactIndex = DEMO_ADDRESS_BOOK.findIndex(
          c => c._id === identity
        )
        const updatedContact = {
          ...DEMO_ADDRESS_BOOK.at(contactIndex),
          ...fieldsToUpdate,
        }
        DEMO_ADDRESS_BOOK.splice(contactIndex, 1, updatedContact)
        resolve(updatedContact)
      }, 500)
    })
  }

  delete(identity: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        DEMO_ADDRESS_BOOK.splice(
          DEMO_ADDRESS_BOOK.findIndex(contract => contract._id === identity),
          1
        )
        resolve()
      }, 500)
    })
  }
}

export default DemoAddressBookManager

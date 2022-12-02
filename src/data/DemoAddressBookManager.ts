import { Contact } from './types/Contact'
import { nanoid } from 'nanoid'
import SortType from 'Types/SortType'

const DEMO_ADDRESS_BOOK: Contact[] = [
  {
    identity: '0',
    name: 'Frankie Boy',
    address: 'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
  },
  {
    identity: '1',
    name: 'Tweetie',
    address: 'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOi',
  },
  {
    identity: '2',
    name: 'Rox1923',
    address: 'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
  },
  {
    identity: '3',
    name: 'Alfred A',
    address: 'iL1ezH4hjVgM4DGz0Sm00lpUN7IiIAMU6SJQznZ2rUg-R5Cqtj7c7Um6zkwh2Dez',
  },
  {
    identity: '4',
    name: 'Derek',
    address: '7C5NxoCyjt86wtEEHEF1d60omCsaH9tFO6Tf6Rn0jqowxowgbBtCoapcSxn0jrXN',
  },
  {
    identity: '5',
    name: 'Jason',
    address: 'OSAblUtjE_cda1CD_baWcpiEWBM3qp0SnZXANluiM7G4psf7Z6ojb3nXFIFaQdBx',
  },
  {
    identity: '5',
    name: '',
    address: 'OSAblUtjE_cda1CD_baWcpiEWBM3qp0SnZXANluiM7G4psf7Z6ojb3nXFIFaQdBx',
  },
]

class DemoAddressBookManager {
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

  findById(identity: string): Promise<Contact> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          DEMO_ADDRESS_BOOK.find(contact => contact.identity === identity)
        )
      }, 500)
    })
  }

  add(name: string, address: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const id = nanoid(64)
        DEMO_ADDRESS_BOOK.push({
          identity: id,
          address: address,
          name: name,
        })
        resolve(id)
      }, 500)
    })
  }

  update(identity: string, name: string, address: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const contact = DEMO_ADDRESS_BOOK.find(c => c.identity === identity)
        contact.name = name
        contact.address = address
        resolve(identity)
      }, 500)
    })
  }

  delete(identity: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        DEMO_ADDRESS_BOOK.splice(
          DEMO_ADDRESS_BOOK.findIndex(
            contract => contract.identity === identity
          ),
          1
        )
        resolve(true)
      }, 500)
    })
  }
}

export default DemoAddressBookManager

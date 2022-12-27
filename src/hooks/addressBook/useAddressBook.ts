import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import SortType from 'Types/SortType'
import Contact from 'Types/Contact'

const useAddressBook = (searchTerm?: string, sort?: SortType) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact[]>()
  const addContact = useCallback(
    (name: string, address: string): Promise<Contact> =>
      window.AddressBookStorage.add({ name, address }).then(contact => {
        loadAddressBook()
        return contact
      }),
    []
  )

  const reloadContacts = useCallback(() => loadAddressBook(), [])

  const loadAddressBook = () =>
    promiseWrapper(window.AddressBookStorage.list(searchTerm, sort))

  useEffect(() => {
    loadAddressBook()
  }, [searchTerm, sort])

  return [result, addContact, reloadContacts] as const
}

export default useAddressBook

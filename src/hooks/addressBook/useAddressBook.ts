import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Contact } from 'Data/types/Contact'
import SortType from 'Types/SortType'

const useAddressBook = (searchTerm?: string, sort?: SortType) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact[]>()
  const addContact = useCallback(
    (name, address) =>
      window.DemoDataManager.addContact(name, address).then(() =>
        loadAddressBook()
      ),
    []
  )

  const loadAddressBook = () =>
    promiseWrapper(window.DemoDataManager.getAddressBook(searchTerm, sort))

  useEffect(() => {
    loadAddressBook()
  }, [searchTerm, sort])

  return [result, addContact] as const
}

export default useAddressBook

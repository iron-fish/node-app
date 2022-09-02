import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Contact } from 'Data/types/Contact'

const useAddressBook = (searchTerm: string, sort?: 'asc' | 'desc') => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact[]>()

  const loadAddressBook = () =>
    promiseWrapper(window.DemoDataManager.getAddressBook(searchTerm, sort))

  useEffect(() => {
    loadAddressBook()
  }, [searchTerm, sort])

  return [result, window.DemoDataManager.addressBook.add]
}

export default useAddressBook

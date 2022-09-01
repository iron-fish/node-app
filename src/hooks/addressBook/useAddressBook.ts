import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Contact } from 'Data/types/Contact'

const useAddressBook = (searchTerm: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact[]>()

  const loadAddressBook = (search: string) =>
    promiseWrapper(window.DemoDataManager.getAddressBook(search))

  useEffect(() => {
    loadAddressBook(searchTerm)
  }, [searchTerm])

  return [result, window.DemoDataManager.addressBook.add]
}

export default useAddressBook

import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import Contact from 'Types/Contact'

const useContactByAddress = (address: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact>()

  const loadContact = () =>
    promiseWrapper(window.AddressBookStorage.find({ address: address }))

  useEffect(() => {
    loadContact()
  }, [address])

  return result
}

export default useContactByAddress

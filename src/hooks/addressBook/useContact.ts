import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Contact } from 'Data/types/Contact'

const useContact = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact>()

  const loadContact = () =>
    promiseWrapper(window.DemoDataManager.getContact(id))

  useEffect(() => {
    loadContact()
  }, [id])

  return [
    result,
    window.DemoDataManager.addressBook.update,
    window.DemoDataManager.addressBook.delete,
  ]
}

export default useContact

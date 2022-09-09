import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Contact } from 'Data/types/Contact'

const useContact = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact>()

  const loadContact = () =>
    promiseWrapper(window.DemoDataManager.getContact(id))

  useEffect(() => {
    loadContact()
  }, [id])

  const update = useCallback(
    (identity: string, name: string, address: string) => {
      return window.DemoDataManager.addressBook
        .update(identity, name, address)
        .then(() => loadContact())
    },
    [id]
  )

  return [result, update, window.DemoDataManager.addressBook.delete] as const
}

export default useContact

import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Contact } from 'Data/types/Contact'

const useContact = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact>()
  const updateContact = useCallback(
    (name, address) =>
      window.DemoDataManager.updateContact(id, name, address).then(() =>
        loadContact()
      ),
    [id]
  )
  const deleteContact = useCallback(
    () => window.DemoDataManager.deleteContact(id),
    [id]
  )

  const loadContact = () =>
    promiseWrapper(window.DemoDataManager.getContact(id))

  useEffect(() => {
    loadContact()
  }, [id])

  return [result, updateContact, deleteContact] as const
}

export default useContact

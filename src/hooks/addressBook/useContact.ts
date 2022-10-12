import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import Contact from 'Types/Contact'

const useContact = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Contact>()
  const updateContact = useCallback(
    (name, address) =>
      window.AddressBookStorage.update(id, { name, address }).then(() =>
        loadContact()
      ),
    [id]
  )
  const deleteContact = useCallback(
    () => window.AddressBookStorage.delete(id),
    [id]
  )

  const loadContact = () => promiseWrapper(window.AddressBookStorage.get(id))

  useEffect(() => {
    loadContact()
  }, [id])

  return [result, updateContact, deleteContact] as const
}

export default useContact

import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import Transaction from 'Types/Transaction'
import SortType from 'Types/SortType'

const useAddressTransactions = (
  address: string,
  searchTerm?: string,
  sortOrder?: SortType
) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction[]>()
  const addContact = useCallback(
    (name, contactAddress) =>
      window.AddressBookStorage.add({ name, address: contactAddress }),
    []
  )

  const loadTransactions = (
    contactAddress: string,
    search: string,
    sort: SortType
  ) =>
    promiseWrapper(
      window.IronfishManager.transactions.findByAddress(address, search, sort)
    )

  useEffect(() => {
    address && loadTransactions(address, searchTerm, sortOrder)
  }, [address, searchTerm, sortOrder])

  return [result, addContact] as const
}

export default useAddressTransactions

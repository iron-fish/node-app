import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import Transaction from 'Types/Transaction'
import SortType from 'Types/SortType'

const useAddressTransactions = (
  address: string,
  search?: string,
  sort?: SortType
) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction[]>()
  const addContact = useCallback(
    (name, contactAddress) =>
      window.AddressBookStorage.add({ name, address: contactAddress }),
    []
  )

  const loadTransactions = () =>
    promiseWrapper(
      window.IronfishManager.transactions.findByAddress(address, search, sort)
    )

  useEffect(() => {
    address && loadTransactions()
  }, [address, search, sort])

  return [result, addContact] as const
}

export default useAddressTransactions

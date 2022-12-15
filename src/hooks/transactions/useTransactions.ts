import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Transaction } from 'Data/types/Transaction'
import SortType from 'Types/SortType'

const useTransactions = (address: string, search?: string, sort?: SortType) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction[]>()
  const addContact = useCallback(
    (name: string, contactAddress: string) =>
      window.DemoDataManager.addContact(name, contactAddress),
    []
  )

  const loadTransactions = () =>
    address &&
    promiseWrapper(
      window.DemoDataManager.findTransactionsByAddress(address, search, sort)
    )

  useEffect(() => {
    loadTransactions()
  }, [address, search, sort])

  return [result, addContact] as const
}

export default useTransactions

import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Transaction } from 'Data/types/Transaction'

const useTransactions = (
  address: string,
  search?: string,
  sort?: 'asc' | 'desc'
) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction[]>()
  const addContact = useCallback(
    (name, contactAddress) =>
      window.DemoDataManager.addContact(name, contactAddress),
    []
  )

  const loadTransactions = () =>
    promiseWrapper(
      window.DemoDataManager.findTransactionsByAddress(address, search, sort)
    )

  useEffect(() => {
    loadTransactions()
  }, [address, search, sort])

  return [result, addContact] as const
}

export default useTransactions

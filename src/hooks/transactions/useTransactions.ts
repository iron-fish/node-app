import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Transaction } from 'Data/types/Transaction'

const useTransactions = (
  address: string,
  search?: string,
  sort?: 'asc' | 'desc'
) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction[]>()

  const loadTransactions = () =>
    promiseWrapper(
      window.DemoDataManager.findTransactionsByAddress(address, search, sort)
    )

  useEffect(() => {
    loadTransactions()
  }, [address, search, sort])

  return [result, window.DemoDataManager.addressBook.add] as const
}

export default useTransactions

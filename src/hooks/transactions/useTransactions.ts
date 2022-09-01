import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { Transaction } from 'Data/types/Transaction'

const useTransactions = (address: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction[]>()

  const loadTransactions = () =>
    promiseWrapper(window.DemoDataManager.findTransactionsByAddress(address))

  useEffect(() => {
    loadTransactions()
  }, [address])

  return [result, window.DemoDataManager.addressBook.add]
}

export default useTransactions

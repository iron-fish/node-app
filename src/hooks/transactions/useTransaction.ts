import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import Transaction from 'Types/Transaction'

const useTransaction = (accountId: string, txHash: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Transaction | null>()

  const loadTransaction = () =>
    promiseWrapper(window.IronfishManager.transactions.get(txHash, accountId))

  useEffect(() => {
    loadTransaction()
  }, [accountId, txHash])

  return result
}

export default useTransaction

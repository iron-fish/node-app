import { useEffect } from 'react'
import AccountBalance from 'Types/AccountBalance'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccountBalance = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountBalance>()

  const loadAccountBalance = (accountId: string) =>
    promiseWrapper(window.IronfishManager.accounts.balance(accountId))

  useEffect(() => {
    id && loadAccountBalance(id)
  }, [id])

  const reload = () => loadAccountBalance(id)

  return [result, reload] as const
}

export default useAccountBalance

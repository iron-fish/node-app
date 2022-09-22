import { useEffect } from 'react'
import { Account } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccount = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Account>()

  const loadAccount = (accountId: string) =>
    promiseWrapper(window.DemoDataManager.getAccount(accountId))

  useEffect(() => {
    id && loadAccount(id)
  }, [id])

  return result
}

export default useAccount

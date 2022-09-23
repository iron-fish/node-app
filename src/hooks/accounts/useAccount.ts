import { useCallback, useEffect } from 'react'
import { Account } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccount = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Account>()

  const loadAccount = (accountId: string) =>
    promiseWrapper(window.DemoDataManager.getAccount(accountId))

  const updateAccount = useCallback((identity: string, name: string) => {
    window.DemoDataManager.updateAccount(identity, name).then(account =>
      loadAccount(identity)
    )
  }, [])

  const deleteAccount = useCallback(
    (identity: string) => window.DemoDataManager.deleteAccount(identity),
    []
  )

  useEffect(() => {
    id && loadAccount(id)
  }, [id])

  return [result, updateAccount, deleteAccount] as const
}

export default useAccount

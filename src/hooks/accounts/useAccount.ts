import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'
import { AccountValue } from '@ironfish/sdk'

const useAccount = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountValue>()

  const loadAccount = (accountId: string) =>
    promiseWrapper(window.IronfishManager.accounts.get(accountId))

  const updateAccount = useCallback((identity: string, name: string) => {
    // Is not support by @ironfish/sdk
    // window.DemoDataManager.updateAccount(identity, name).then(() =>
    //   loadAccount(identity)
    // )
  }, [])

  const exportAccount = useCallback(
    (identity: string) => window.IronfishManager.accounts.export(identity),
    []
  )

  const deleteAccount = useCallback(
    (name: string) => window.IronfishManager.accounts.delete(name),
    []
  )

  useEffect(() => {
    id && loadAccount(id)
  }, [id])

  return [result, updateAccount, exportAccount, deleteAccount] as const
}

export default useAccount

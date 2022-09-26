import { useEffect, useCallback } from 'react'
import { AccountKeys } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccountKeys = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountKeys>()

  const loadAccountKeys = (accountId: string) =>
    promiseWrapper(window.DemoDataManager.getAccountKeys(accountId))

  const updateKeys = useCallback(
    (keys: AccountKeys) =>
      window.DemoDataManager.updateAccountKeys(keys).then(() =>
        loadAccountKeys(keys.accountId)
      ),
    []
  )

  useEffect(() => {
    id && loadAccountKeys(id)
  }, [id])

  return [result, updateKeys] as const
}

export default useAccountKeys

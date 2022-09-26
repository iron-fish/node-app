import { useEffect, useCallback } from 'react'
import { AccountSettings } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccountSettings = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountSettings>()

  const loadAccountSettings = (accountId: string) =>
    promiseWrapper(window.DemoDataManager.getAccountSettings(accountId))

  const updateSettings = useCallback(
    (accountId: string, currency: string) =>
      window.DemoDataManager.updateAccountSettings(accountId, currency).then(
        () => loadAccountSettings(accountId)
      ),
    []
  )

  useEffect(() => {
    id && loadAccountSettings(id)
  }, [id])

  return [result, updateSettings] as const
}

export default useAccountSettings

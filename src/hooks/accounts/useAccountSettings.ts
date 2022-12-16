import { useEffect, useCallback } from 'react'
import AccountSettings from 'Types/AccountSettings'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccountSettings = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountSettings>()

  const loadAccountSettings = (accountId: string) =>
    promiseWrapper(window.AccountSettingsStorage.find({ accountId }))

  const updateSettings = useCallback(
    (accountId: string, currency: string) =>
      result.data
        ? window.AccountSettingsStorage.update(result.data._id, {
            currency,
          }).then(() => loadAccountSettings(accountId))
        : window.AccountSettingsStorage.add({ accountId, currency }).then(() =>
            loadAccountSettings(accountId)
          ),
    [JSON.stringify(result.data)]
  )

  useEffect(() => {
    id && loadAccountSettings(id)
  }, [id])

  return [result, updateSettings] as const
}

export default useAccountSettings

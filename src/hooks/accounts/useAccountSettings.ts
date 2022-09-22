import { useEffect } from 'react'
import { AccountSettings } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccountSettings = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountSettings>()

  const loadAccountSettings = (accountId: string) =>
    promiseWrapper(window.DemoDataManager.getAccountSettings(accountId))

  useEffect(() => {
    id && loadAccountSettings(id)
  }, [id])

  return result
}

export default useAccountSettings

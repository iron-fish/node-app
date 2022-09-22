import { useEffect } from 'react'
import { AccountKeys } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccountKeys = (id: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountKeys>()

  const loadAccountKeys = (accountId: string) =>
    promiseWrapper(window.DemoDataManager.getAccountKeys(accountId))

  useEffect(() => {
    id && loadAccountKeys(id)
  }, [id])

  return result
}

export default useAccountKeys

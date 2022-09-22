import { useEffect } from 'react'
import { Account } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useAccounts = (searchTerm = '') => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Account[]>()

  const loadAccounts = (search: string) =>
    promiseWrapper(window.DemoDataManager.getAccounts(search))

  useEffect(() => {
    loadAccounts(searchTerm)
  }, [searchTerm])

  return result
}

export default useAccounts

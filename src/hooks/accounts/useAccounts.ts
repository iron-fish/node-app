import { useEffect } from 'react'
import { Account } from 'Data/types/Account'
import useAsyncDataWrapper from '../useAsyncDataWrapper'
import SortType from 'Types/SortType'

const useAccounts = (searchTerm = '', sortOrder = SortType.ASC) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Account[]>()

  const loadAccounts = (search: string) =>
    promiseWrapper(window.DemoDataManager.getAccounts(search))

  useEffect(() => {
    loadAccounts(searchTerm)
  }, [searchTerm])

  return result
}

export default useAccounts

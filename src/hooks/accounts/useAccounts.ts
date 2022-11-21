import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'
import SortType from 'Types/SortType'
import CutAccount from 'Types/CutAccount'

const useAccounts = (searchTerm = '', sortOrder = SortType.ASC) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<CutAccount[]>()

  const loadAccounts = (search: string) =>
    promiseWrapper(window.IronfishManager.accounts.list(search))

  useEffect(() => {
    loadAccounts(searchTerm)
  }, [searchTerm])

  const reloadAccounts = () => loadAccounts(searchTerm)

  return [result, reloadAccounts] as const
}

export default useAccounts

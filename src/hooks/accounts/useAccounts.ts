import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'
import SortType from 'Types/SortType'
import CutAccount from 'Types/CutAccount'

const useAccounts = (searchTerm = '', sortOrder = SortType.ASC) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<CutAccount[]>()

  const loadAccounts = (search: string, sort: SortType) =>
    promiseWrapper(window.IronfishManager.accounts.list(search))

  useEffect(() => {
    loadAccounts(searchTerm, sortOrder)
  }, [searchTerm, sortOrder])

  const reloadAccounts = () => loadAccounts(searchTerm, sortOrder)

  return [result, reloadAccounts] as const
}

export default useAccounts

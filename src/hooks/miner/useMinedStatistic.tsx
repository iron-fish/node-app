import { AccountMinerStatistic } from 'Data/types/AccountMiner'
import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useMinedStatistic = (accountId: string, from?: string, to?: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountMinerStatistic>()

  const loadStatistic = () => {
    promiseWrapper(
      window.DemoDataManager.getAccountMinerStatistic(accountId, from, to)
    )
  }

  useEffect(() => {
    accountId && loadStatistic()
  }, [accountId, from, to])

  return result
}

export default useMinedStatistic

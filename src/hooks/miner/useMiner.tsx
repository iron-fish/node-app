import { useCallback, useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useMiner = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<'active' | 'stopped'>()

  const loadMiner = () => {
    promiseWrapper(
      window.DemoDataManager.getAccountMinerStatus().then(data => data.status)
    )
  }

  const start = useCallback((accountId: string) => {
    return window.DemoDataManager.startMining(accountId).then(() => loadMiner())
  }, [])
  const stop = useCallback(() => {
    return window.DemoDataManager.stopMining().then(() => loadMiner())
  }, [])

  useEffect(() => {
    loadMiner()
  }, [])

  return [result, start, stop] as const
}

export default useMiner

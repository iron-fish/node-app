import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'

const useUpdatesCount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<number>()

  useEffect(() => {
    promiseWrapper(
      window.UpdateManager.getNewVersions().then(versions => versions.length)
    )
  }, [])

  return result
}

export default useUpdatesCount

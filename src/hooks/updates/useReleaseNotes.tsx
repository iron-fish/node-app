import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'
import { ReleaseNote } from 'Types/IUpdateManager'

const useReleaseNotes = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<ReleaseNote[]>([])

  useEffect(() => {
    promiseWrapper(window.UpdateManager.notes())
  }, [])

  return result
}

export default useReleaseNotes

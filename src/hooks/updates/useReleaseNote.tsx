import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'
import { ReleaseNote } from 'Types/IUpdateManager'

const useReleaseNote = (version: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<ReleaseNote>()

  useEffect(() => {
    promiseWrapper(window.UpdateManager.note(version))
  }, [version])

  return result
}

export default useReleaseNote

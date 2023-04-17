import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'
import { UpdateReleaseNotesResponse } from 'Types/IUpdateManager'

const useReleaseNotes = () => {
  const [result, promiseWrapper] =
    useAsyncDataWrapper<UpdateReleaseNotesResponse>()

  useEffect(() => {
    promiseWrapper(window.UpdateManager.notes())
  }, [])

  return result
}

export default useReleaseNotes

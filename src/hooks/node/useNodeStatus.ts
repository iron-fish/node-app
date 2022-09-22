import { GetStatusResponse } from '@ironfish/sdk'
import { useEffect, useState } from 'react'

const useNodeStatus = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<GetStatusResponse | undefined>()
  const [error, setError] = useState()

  const loadStatus = () => {
    return window.DemoDataManager.getNodeStatus()
      .then(setNodeStatus)
      .catch(setError)
      .finally(() => setLoaded(true))
  }

  useEffect(() => {
    const infinite = setInterval(() => {
      loadStatus()
    }, 1000)
    return () => clearInterval(infinite)
  }, [])

  return {
    loaded,
    data: status,
    error,
  }
}

export default useNodeStatus

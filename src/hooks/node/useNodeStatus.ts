import { useEffect, useState } from 'react'
import NodeStatusResponse from 'Types/NodeStatusResponse'

const useNodeStatus = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<NodeStatusResponse | undefined>()
  const [error, setError] = useState()

  const loadStatus = () => {
    return window.IronfishManager.nodeStatus
      .get()
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

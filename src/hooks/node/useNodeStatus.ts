import { useEffect, useState } from 'react'
import NodeStatusResponse from 'Types/NodeStatusResponse'

const useNodeStatus = (pauseTracking = false) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<NodeStatusResponse | undefined>()
  const [error, setError] = useState()

  const loadStatus = () => {
    return window.IronfishManager.nodeStatus()
      .then(setNodeStatus)
      .catch(setError)
      .finally(() => setLoaded(true))
  }

  useEffect(() => {
    let infinite: NodeJS.Timer
    if (!pauseTracking) {
      infinite = setInterval(() => {
        loadStatus()
      }, 1000)
    }
    return () => infinite && clearInterval(infinite)
  }, [pauseTracking])

  return {
    loaded,
    data: status,
    error,
  }
}

export default useNodeStatus

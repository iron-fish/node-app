import { useEffect, useState } from 'react'
import { UpdateStatus } from 'Types/IUpdateManager'

const useUpdates = () => {
  const [status, setStatus] = useState<UpdateStatus>()

  const loadUpdateStatus = () => {
    window.UpdateManager.checkUpdates().then(setStatus)
  }

  useEffect(() => {
    if (!status) {
      loadUpdateStatus()
    }

    const interval = status?.ignoreUpdates
      ? null
      : setInterval(loadUpdateStatus, 300000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [status?.ignoreUpdates])

  return {
    status,
    install: () =>
      window.UpdateManager.installUpdates().then(() => loadUpdateStatus()),
    ignore: () => window.UpdateManager.ignoreUpdates().then(setStatus),
  }
}

export default useUpdates

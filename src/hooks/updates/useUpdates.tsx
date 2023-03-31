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

    const interval = setInterval(loadUpdateStatus, 300000)

    return () => {
      interval && clearInterval(interval)
    }
  }, [])

  return {
    status,
    install: () => window.UpdateManager.installUpdates(),
    ignore: () => window.UpdateManager.ignoreUpdates(),
  }
}

export default useUpdates

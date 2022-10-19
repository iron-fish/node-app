import {
  FC,
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

import { GetStatusResponse } from '@ironfish/sdk'

export interface DataSyncContextProps {
  data?: GetStatusResponse | undefined
  loaded?: boolean
  error?: unknown
}

const DataSyncContext = createContext<DataSyncContextProps>({
  loaded: false,
})

interface DataSyncProviderProps {
  children: ReactNode
}

const DataSyncProvider: FC<DataSyncProviderProps> = ({ children }) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<GetStatusResponse | undefined>()
  const [error, setError] = useState()

  const loadStatus = () => {
    return window.DemoDataManager.getNodeStatus()
      .then(setNodeStatus)
      .catch(setError)
  }

  // demo trigger for dataSync
  useEffect(() => {
    window.DemoDataManager.syncNodeData().then(() => loadStatus())
    const syncInterval = setInterval(
      () => window.DemoDataManager.syncNodeData().then(() => loadStatus()),
      5 * 60 * 1000
    )
    return () => clearInterval(syncInterval)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status?.blockSyncer.status === 'syncing') {
      setLoaded(false)
      interval = setInterval(() => {
        loadStatus()
      }, 1000)
    } else {
      setLoaded(true)
      interval = setInterval(() => {
        loadStatus()
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [status?.blockSyncer.status])

  const value = { loaded, data: status, error }

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  )
}

function useDataSync() {
  const context = useContext(DataSyncContext)
  if (context === undefined) {
    throw new Error('useDataSync must be used within a DataSyncProvider')
  }
  return context
}

export { DataSyncProvider, useDataSync }

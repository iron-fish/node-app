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
  const [syncInterval, setSyncInterval] = useState(null)

  const loadStatus = () => {
    return window.DemoDataManager.getNodeStatus()
      .then(setNodeStatus)
      .catch(setError)
  }

  useEffect(() => {
    window.DemoDataManager.syncNodeData().then(() => loadStatus())
  }, [])

  useEffect(() => {
    if (status?.blockSyncer.status === 'syncing') {
      setLoaded(false)
      const infinite = setInterval(() => {
        loadStatus()
      }, 1000)
      setSyncInterval(infinite)
    } else if (
      status?.blockSyncer.status === 'idle' ||
      status?.blockSyncer.status === 'stopped'
    ) {
      setLoaded(true)
      syncInterval && clearInterval(syncInterval)
    }
    return () => syncInterval && clearInterval(syncInterval)
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

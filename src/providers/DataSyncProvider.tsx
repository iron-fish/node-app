import {
  FC,
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

import NodeStatusResponse from 'Types/NodeStatusResponse'

export interface DataSyncContextProps {
  data?: NodeStatusResponse | undefined
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
  const [status, setNodeStatus] = useState<NodeStatusResponse | undefined>()
  const [error, setError] = useState()

  const loadStatus = () => {
    return window.IronfishManager.nodeStatus()
      .then(setNodeStatus)
      .catch(setError)
  }

  useEffect(() => {
    loadStatus()
  }, [])

  useEffect(() => {
    const interval = setInterval(
      () => {
        loadStatus()
      },
      status?.blockchain.synced ? 10000 : 1000
    )
    return () => clearInterval(interval)
  }, [status?.blockSyncer.status])

  const value = { loaded: status?.blockchain.synced, data: status, error }

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

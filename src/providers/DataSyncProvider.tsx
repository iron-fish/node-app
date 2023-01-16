import { FC, createContext, useContext, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import NodeStatusResponse from 'Types/NodeStatusResponse'

export interface DataSyncContextProps {
  data?: NodeStatusResponse | undefined
  loaded?: boolean
  error?: unknown
}

const DataSyncContext = createContext<DataSyncContextProps>({
  loaded: false,
})

const DataSyncProvider: FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
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
    setLoaded(status?.blockchain.synced)
    const interval = setInterval(
      () => {
        loadStatus()
        status?.blockchain.synced && window.IronfishManager.sync()
      },
      status?.blockchain.synced ? 10000 : 5000
    )
    return () => clearInterval(interval)
  }, [status?.blockchain.synced])

  const value = { loaded, data: status, error }

  return (
    <DataSyncContext.Provider value={value}>
      <Outlet />
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

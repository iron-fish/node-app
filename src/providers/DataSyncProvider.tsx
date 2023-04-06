import {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { ProgressStatus } from 'Types/IronfishManager/IIronfishSnapshotManager'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import { useSnapshotStatus } from './SnapshotProvider'

export interface DataSyncContextProps {
  data?: NodeStatusResponse | undefined
  synced?: boolean
  requiredSnapshot?: boolean
  error?: unknown
  sync: {
    start: () => Promise<void>
    stop: () => Promise<void>
  }
}

const DataSyncContext = createContext<DataSyncContextProps>({
  synced: false,
  sync: {
    start: () => window.IronfishManager.sync(),
    stop: () => window.IronfishManager.stopSyncing(),
  },
})

const DataSyncProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [synced, setSynced] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<NodeStatusResponse | undefined>()
  const [error, setError] = useState()
  const { status: snapshotStatus } = useSnapshotStatus()

  const loadStatus = () =>
    window.IronfishManager.nodeStatus().then(setNodeStatus).catch(setError)

  const stopSyncing = useCallback(
    () => window.IronfishManager.stopSyncing(),
    []
  )
  const startSyncing = useCallback(() => window.IronfishManager.sync(), [])

  useEffect(() => {
    if (!status) {
      loadStatus()
      return
    }

    if (
      status &&
      status?.blockSyncer.syncing &&
      status?.blockSyncer.syncing.progress < 0.5
    ) {
      stopSyncing()
    }

    setSynced(!!status?.blockchain.synced)
    const interval = setInterval(
      () => {
        loadStatus()
      },
      status?.blockchain.synced ? 10000 : 5000
    )
    return () => clearInterval(interval)
  }, [status?.blockchain.synced, status?.blockSyncer.syncing?.progress])

  const value = {
    synced,
    data: status,
    error,
    requiredSnapshot:
      snapshotStatus?.status === ProgressStatus.NOT_STARTED &&
      status &&
      status?.blockSyncer.syncing &&
      status?.blockSyncer.syncing.progress < 0.5,
    sync: {
      start: startSyncing,
      stop: stopSyncing,
    },
  } as DataSyncContextProps

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

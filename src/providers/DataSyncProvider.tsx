import {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react'
import { ProgressStatus } from 'Types/IronfishManager/IIronfishSnapshotManager'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import { useSnapshotStatus } from './SnapshotProvider'
import useUpdates from 'Hooks/updates/useUpdates'
import { UpdateStatus } from 'Types/IUpdateManager'

const SNAPSHOT_DOWNLOAD_BLOCKS_LIMIT = 20000

export interface DataSyncContextProps {
  data?: NodeStatusResponse | undefined
  synced?: boolean
  requiredSnapshot?: boolean
  error?: unknown
  sync: {
    start: () => Promise<void>
    stop: () => Promise<void>
  }
  updates?: {
    status: UpdateStatus
    install: () => Promise<void>
    ignore: () => Promise<void>
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
  const updates = useUpdates()

  const loadStatus = () =>
    window.IronfishManager.nodeStatus()
      .then(nextStatus => {
        setNodeStatus({
          blockSyncer: nextStatus.blockSyncer,
          blockchain: nextStatus.blockchain,
          peerNetwork: {
            isReady: nextStatus.peerNetwork?.isReady,
            peers: nextStatus.peerNetwork?.peers || 0,
          },
        })
      })
      .catch(setError)

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
      status?.blockSyncer.syncing.progress < 0.5 &&
      Number(status?.blockchain?.totalSequences || 0) -
        Number(status?.blockchain?.head) >
        SNAPSHOT_DOWNLOAD_BLOCKS_LIMIT
    ) {
      stopSyncing()
    }

    setSynced(
      !!status?.blockchain.synced &&
        status?.peerNetwork?.isReady &&
        status?.peerNetwork?.peers > 0
    )
    const interval = setInterval(
      () => {
        loadStatus()
      },
      status?.blockchain.synced && status?.blockSyncer?.syncing?.progress === 1
        ? 10000
        : 2000
    )
    return () => clearInterval(interval)
  }, [
    status?.blockchain?.synced,
    status?.blockSyncer?.syncing?.progress,
    status?.peerNetwork?.isReady,
    status?.peerNetwork?.peers > 0,
  ])

  const value = useMemo(() => {
    return {
      synced,
      data: status,
      error,
      requiredSnapshot:
        snapshotStatus?.status === ProgressStatus.NOT_STARTED &&
        status &&
        status?.blockSyncer.syncing &&
        status?.blockSyncer.syncing.progress < 0.5 &&
        Number(status?.blockchain?.totalSequences || 0) -
          Number(status?.blockchain?.head) >
          SNAPSHOT_DOWNLOAD_BLOCKS_LIMIT,
      sync: {
        start: startSyncing,
        stop: stopSyncing,
      },
      updates,
    } as DataSyncContextProps
  }, [
    synced,
    JSON.stringify(status),
    JSON.stringify(snapshotStatus),
    JSON.stringify(updates.status),
  ])

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

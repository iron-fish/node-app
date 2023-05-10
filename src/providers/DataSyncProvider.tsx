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
import { SnapshotProgressStatus } from 'Types/IronfishManager/IIronfishSnapshotManager'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import { useSnapshotStatus } from './SnapshotProvider'
import useUpdates from 'Hooks/updates/useUpdates'
import { UpdateStatus } from 'Types/IUpdateManager'
import useSnapshotManifest from 'Hooks/snapshot/useSnapshotManifest'

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

const CHAIN_SYNC_PROGRESS_THRESHOLD = 0.7
const SNAPSHOT_VALUABLE_PROGRESS = 0.3

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
  const [manifest] = useSnapshotManifest()

  const loadStatus = () =>
    window.IronfishManager.nodeStatus()
      .then(nextStatus => {
        setNodeStatus(prevStatus => {
          let nextTotalSequences = nextStatus.blockchain.totalSequences
          if (
            nextTotalSequences === '0' &&
            prevStatus?.blockchain?.totalSequences
          ) {
            nextTotalSequences = prevStatus.blockchain.totalSequences
          }
          return {
            blockSyncer: nextStatus.blockSyncer,
            blockchain: {
              ...nextStatus.blockchain,
              totalSequences: nextTotalSequences,
            },
            peerNetwork: {
              isReady: nextStatus.peerNetwork?.isReady,
              peers: nextStatus.peerNetwork?.peers || 0,
            },
          }
        })
      })
      .catch(setError)

  const isSnapshotRequired = useMemo(() => {
    if (status?.blockSyncer.syncing.progress > CHAIN_SYNC_PROGRESS_THRESHOLD) {
      return false
    }
    if (
      !status?.blockchain?.totalSequences ||
      status?.blockchain?.totalSequences === '0' ||
      !manifest?.block_sequence
    ) {
      return false
    }
    const total = Number(status?.blockchain?.totalSequences)
    const headToSnapshot =
      manifest.block_sequence - Number(status?.blockchain?.head)
    const snapshotToTotal = headToSnapshot / total
    return snapshotToTotal > SNAPSHOT_VALUABLE_PROGRESS
  }, [
    JSON.stringify(manifest),
    status?.blockSyncer.syncing.progress,
    status?.blockchain?.totalSequences,
  ])

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

    if (Number(status?.blockchain?.totalSequences) > 0 && isSnapshotRequired) {
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
      snapshotStatus.status !== SnapshotProgressStatus.NOT_STARTED ||
        isSnapshotRequired ||
        (status?.blockchain.synced &&
          status?.blockSyncer?.syncing?.progress === 1)
        ? 10000
        : 2000
    )
    return () => clearInterval(interval)
  }, [
    status?.blockchain?.synced,
    status?.blockSyncer?.syncing?.progress,
    status?.peerNetwork?.isReady,
    status?.peerNetwork?.peers > 0,
    isSnapshotRequired,
  ])

  const value = useMemo(() => {
    return {
      synced,
      data: status,
      error,
      requiredSnapshot:
        snapshotStatus?.status === SnapshotProgressStatus.NOT_STARTED &&
        isSnapshotRequired,
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
    isSnapshotRequired,
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

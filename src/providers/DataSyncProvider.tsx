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

type NodeStatus = Required<
  Pick<
    NodeStatusResponse,
    'blockSyncer' | 'blockchain' | 'peerNetwork' | 'accounts'
  >
>
export interface DataSyncContextProps {
  data?: NodeStatus | undefined
  synced?: boolean
  accountsSynced?: boolean
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

const SNAPSHOT_VALUABLE_PROGRESS = 20

const DataSyncContext = createContext<DataSyncContextProps>({
  synced: false,
  sync: {
    start: () => window.IronfishManager.sync(),
    stop: () => window.IronfishManager.stopSyncing(),
  },
})

const DataSyncProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [synced, setSynced] = useState<boolean>(false)
  const [accountsSynced, setAccountsSynced] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<NodeStatus | undefined>()
  const [error, setError] = useState()
  const { status: snapshotStatus } = useSnapshotStatus()
  const updates = useUpdates()
  const [manifest] = useSnapshotManifest()

  const loadStatus = () =>
    window.IronfishManager.nodeStatus()
      .then(nextStatus => {
        if (!nextStatus) {
          return
        }

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
            accounts: nextStatus.accounts,
          }
        })
      })
      .catch(setError)

  const isSnapshotRequired = useMemo(() => {
    if (!manifest?.block_sequence) {
      return false
    }
    return (
      Number(status?.blockchain?.head) < SNAPSHOT_VALUABLE_PROGRESS &&
      snapshotStatus.status !== SnapshotProgressStatus.DECLINED
    )
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
    setAccountsSynced(
      status?.accounts.every(
        account => Number(account.sequence) > Number(status.blockchain.head) - 2
      )
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
    status?.accounts,
    status?.blockSyncer?.syncing?.progress,
    status?.peerNetwork?.isReady,
    status?.peerNetwork?.peers > 0,
    isSnapshotRequired,
  ])

  const value = useMemo<DataSyncContextProps>(() => {
    return {
      synced,
      accountsSynced,
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
    }
  }, [
    synced,
    accountsSynced,
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

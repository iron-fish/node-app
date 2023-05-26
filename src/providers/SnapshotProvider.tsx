import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import EventType from 'Types/EventType'
import {
  SnapshotProgressStatus,
  SnapshotProgressType,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'

export interface SnapshotProviderProps {
  status: Omit<SnapshotProgressType, 'statistic'>
  checkPath: (
    manifest: SnapshotManifest,
    path?: string
  ) => Promise<{ hasError: boolean; error: string }>
  start: (path?: string) => Promise<void>
  retry: () => Promise<void>
  reset: () => Promise<void>
}

const SnapshotContext = createContext<SnapshotProviderProps>({
  status: {
    status: SnapshotProgressStatus.NOT_STARTED,
    current: 0,
    estimate: 0,
    hasError: false,
    total: 0,
  },
  checkPath: (manifest: SnapshotManifest, path?: string) =>
    window.IronfishManager.snapshot.checkPath(manifest, path),
  start: (path?: string) => window.IronfishManager.downloadChainSnapshot(path),
  retry: () => window.IronfishManager.snapshot.retry(),
  reset: () => window.IronfishManager.snapshot.reset(),
})

const SnapshotProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] =
    useState<Omit<SnapshotProgressType, 'statistic'>>(null)

  const loadStatus = () => {
    window.IronfishManager.snapshot.status().then(setStatus)
    window.subscribeOn(EventType.SNAPSHOT_STATUS_CHANGE, setStatus)
  }
  const checkPath = useCallback(
    (manifest: SnapshotManifest, path?: string) =>
      window.IronfishManager.snapshot.checkPath(manifest, path),
    []
  )
  const start = useCallback(
    (path?: string) => window.IronfishManager.downloadChainSnapshot(path),
    []
  )
  const retry = useCallback(() => window.IronfishManager.snapshot.retry(), [])
  const reset = useCallback(() => window.IronfishManager.snapshot.reset(), [])

  useEffect(() => {
    loadStatus()
  }, [])

  useEffect(() => {
    if (!status) {
      return
    }

    if (status.status === SnapshotProgressStatus.DOWNLOADED) {
      window.IronfishManager.snapshot.apply()
    }

    if (status.status === SnapshotProgressStatus.COMPLETED) {
      window.IronfishManager.initialize()
      window.IronfishManager.snapshot.reset()
    }
    if (status.status === SnapshotProgressStatus.DECLINED) {
      window.IronfishManager.sync()
    }
  }, [status?.status])

  return (
    <SnapshotContext.Provider
      value={{
        status,
        start,
        checkPath,
        retry,
        reset,
      }}
    >
      {children}
    </SnapshotContext.Provider>
  )
}

export const useSnapshotStatus = () => {
  const context = useContext(SnapshotContext)
  if (context === undefined) {
    throw new Error('useSnapshotStatus must be used within a SnapshotProvider')
  }
  return context
}

export default SnapshotProvider

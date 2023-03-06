import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  ProgressStatus,
  ProgressType,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'

export interface SnapshotProviderProps {
  status: Omit<ProgressType, 'statistic'>
  checkPath: (
    manifest: SnapshotManifest,
    path?: string
  ) => Promise<{ hasError: boolean; error: string }>
  start: (path?: string) => Promise<void>
}

const SnapshotContext = createContext<SnapshotProviderProps>({
  status: {
    status: ProgressStatus.NOT_STARTED,
    current: 0,
    estimate: 0,
    hasError: false,
    total: 0,
  },
  checkPath: (manifest: SnapshotManifest, path?: string) =>
    window.IronfishManager.snapshot.checkPath(manifest, path),
  start: (path?: string) => window.IronfishManager.downloadChainSnapshot(path),
})

const SnapshotProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<Omit<ProgressType, 'statistic'>>(null)

  const loadStatus = () => {
    window.IronfishManager.snapshot.status().then(setStatus)
  }
  const checkPath = useCallback(
    (manifest: SnapshotManifest, path?: string) =>
      window.IronfishManager.snapshot.checkPath(manifest, path),
    []
  )
  const start = useCallback(
    (path?: string) =>
      window.IronfishManager.downloadChainSnapshot(path).then(() => {
        setTimeout(loadStatus, 250)
      }),
    []
  )

  useEffect(() => {
    let interval: NodeJS.Timer

    if (!status) {
      loadStatus()
      return
    }

    if (status.status === ProgressStatus.DOWNLOADED) {
      window.IronfishManager.snapshot.apply()
    }

    if (status.status === ProgressStatus.COMPLETED) {
      window.IronfishManager.initialize()
      window.IronfishManager.snapshot.reset()
    }

    if (
      status?.status > ProgressStatus.NOT_STARTED &&
      status?.status < ProgressStatus.COMPLETED
    ) {
      interval = setInterval(loadStatus, 500)
    }

    return () => interval && clearInterval(interval)
  }, [status?.status])

  return (
    <SnapshotContext.Provider
      value={{
        status,
        start,
        checkPath,
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

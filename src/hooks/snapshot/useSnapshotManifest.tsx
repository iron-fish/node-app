import { useEffect, useState } from 'react'
import { SnapshotManifest } from 'Types/IronfishManager/IIronfishSnapshotManager'

const useSnapshotManifest = () => {
  const [manifest, setManifest] = useState<SnapshotManifest>(null)

  const loadManifest = () =>
    window.IronfishManager.snapshot.manifest().then(setManifest)

  useEffect(() => {
    loadManifest()
  }, [])

  const reload = loadManifest

  return [manifest, reload] as const
}

export default useSnapshotManifest

import { FC, useState } from 'react'
import sizeFormat from 'byte-size'
import { chakra } from '@ironfish/ui-kit'
import useSnapshotManifest from 'Hooks/snapshot/useSnapshotManifest'
import SnapshotDownloadModal from 'Components/Snapshot/SnapshotDownloadModal'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import { useDataSync } from 'Providers/DataSyncProvider'

const SnapshotRequirement: FC<{
  data: NodeStatusResponse | undefined
  isMinified: boolean
}> = ({ data, isMinified }) => {
  const [open, setOpen] = useState(true)
  const [manifest] = useSnapshotManifest()
  const { requiredSnapshot } = useDataSync()

  return (
    <>
      <chakra.h5
        color="inherit"
        m="0.5rem"
        display={isMinified ? 'none' : 'inherit'}
      >
        Choosing how to sync the chain
      </chakra.h5>
      <SnapshotDownloadModal
        isOpen={open && requiredSnapshot}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false)
        }}
        size={sizeFormat(manifest?.file_size).toString()}
        estimateTime={formatRemainingTime(
          ((Number(manifest?.block_sequence || 0) -
            Number(data?.blockchain?.head || 0)) *
            1000) /
            (data?.blockSyncer?.syncing?.speed || 1)
        )}
        manifest={manifest}
      />
    </>
  )
}

export default SnapshotRequirement

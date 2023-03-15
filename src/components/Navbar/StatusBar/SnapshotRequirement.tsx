import { FC, useState } from 'react'
import { WarningIcon } from '@chakra-ui/icons'
import sizeFormat from 'byte-size'
import { Button, chakra } from '@ironfish/ui-kit'
import useSnapshotManifest from 'Hooks/snapshot/useSnapshotManifest'
import SnapshotDownloadModal from 'Components/Snapshot/SnapshotDownloadModal'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'
import NodeStatusResponse from 'Types/NodeStatusResponse'

const SnapshotRequirement: FC<{
  data: NodeStatusResponse | undefined
  isMinified: boolean
}> = ({ data, isMinified }) => {
  const [open, setOpen] = useState(false)
  const [manifest] = useSnapshotManifest()

  return (
    <>
      <WarningIcon
        display={isMinified ? 'inherit' : 'none'}
        color="inherit"
        w="1.25rem"
        h="0.9375rem"
        onClick={() => setOpen(true)}
      />
      <chakra.h5
        color="inherit"
        m="0.5rem"
        display={isMinified ? 'none' : 'inherit'}
      >
        You’re required to download our blockchain snapshot
        <chakra.span display={isMinified ? 'block' : 'none'}>
          Click on icon to download
        </chakra.span>
      </chakra.h5>
      <Button
        variant="outline"
        color="inherit"
        borderColor="inherit"
        borderRadius="4rem"
        mb="1rem"
        _hover={{
          bg: '#FFEEE9',
        }}
        _dark={{
          _hover: {
            bg: '#6A3C27',
          },
        }}
        display={{ base: 'none', sm: 'inline-flex' }}
        onClick={() => setOpen(true)}
      >
        <chakra.h5 color="inherit">Download Snapshot</chakra.h5>
      </Button>
      <SnapshotDownloadModal
        isOpen={open}
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

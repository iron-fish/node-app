import {
  Flex,
  Box,
  NAMED_COLORS,
  chakra,
  Button,
  Collapse,
} from '@ironfish/ui-kit'
import SnapshotDownloadModal from 'Components/Snapshot/SnapshotDownloadModal'
import useSnapshotManifest from 'Hooks/snapshot/useSnapshotManifest'
import { useDataSync } from 'Providers/DataSyncProvider'
import { FC, useState } from 'react'
import sizeFormat from 'byte-size'
import { Outlet } from 'react-router-dom'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'

import Navbar from '../components/Navbar'

const DownloadSnapshotMessage: FC<{
  show: boolean
  data: NodeStatusResponse
}> = ({ show, data }) => {
  const [open, setOpen] = useState(false)
  const [manifest] = useSnapshotManifest()
  return (
    <Collapse in={show} startingHeight={0} endingHeight="3rem">
      <Flex
        w="100%"
        bg="#FFE2D9"
        h={show ? '3rem' : '0rem'}
        justifyContent="center"
        alignItems="center"
      >
        <chakra.h5 mx="0.5rem" color={NAMED_COLORS.RED} hidden={!show}>
          You’re required to download our blockchain snapshot
        </chakra.h5>
        <Button
          variant="outline"
          color={NAMED_COLORS.RED}
          borderColor={NAMED_COLORS.RED}
          borderRadius="4rem"
          h="2.2rem"
          hidden={!show}
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
      </Flex>
    </Collapse>
  )
}

export const PageLayout: FC = () => {
  const { data, requiredSnapshot } = useDataSync()
  return (
    <>
      <DownloadSnapshotMessage show={requiredSnapshot} data={data} />
      <Flex
        top="0"
        className="App"
        justifyContent="center"
        minHeight={requiredSnapshot ? 'calc(100vh - 3rem)' : '100vh'}
      >
        <Navbar
          top={requiredSnapshot ? '3rem' : '0'}
          maxHeight={requiredSnapshot ? 'calc(100vh - 3rem)' : '100vh'}
        />
        <Box marginLeft={{ base: '6rem', sm: '17rem' }} w="100%">
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            px="2rem"
            py="2.5rem"
          >
            <Box width="100%" height="100%" maxWidth="65.5rem">
              <Outlet />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default PageLayout

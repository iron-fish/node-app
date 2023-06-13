import {
  Flex,
  Box,
  chakra,
  Button,
  Collapse,
  ScaleFade,
  Link,
} from '@ironfish/ui-kit'
import SnapshotDownloadModal from 'Components/Snapshot/SnapshotDownloadModal'
import useSnapshotManifest from 'Hooks/snapshot/useSnapshotManifest'
import { useDataSync } from 'Providers/DataSyncProvider'
import { FC, useState } from 'react'
import sizeFormat from 'byte-size'
import { Outlet, useLocation } from 'react-router-dom'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'
import Navbar from '../components/Navbar'
import {
  DARK_COLORS,
  LIGHT_COLORS,
} from 'Components/Navbar/StatusBar/StatusItem'
import ModalWindow from 'Components/ModalWindow'
import { ROUTES } from '../routes'

const DownloadSnapshotMessage: FC<{
  show: boolean
  data: NodeStatusResponse
}> = ({ show, data }) => {
  const [open, setOpen] = useState(false)
  const [manifest] = useSnapshotManifest()
  return (
    <Collapse
      in={show}
      startingHeight={0}
      endingHeight="3rem"
      style={{
        position: 'sticky',
        zIndex: 99,
        top: 0,
      }}
    >
      <Flex
        w="100%"
        bg={LIGHT_COLORS.bg.warning}
        h={show ? '3rem' : '0rem'}
        justifyContent="center"
        alignItems="center"
        _dark={{
          bg: DARK_COLORS.bg.warning,
        }}
      >
        <chakra.h5
          mx="0.5rem"
          color={LIGHT_COLORS.text.warning}
          _dark={{ color: DARK_COLORS.text.warning }}
          hidden={!show}
        >
          You’re required to download our blockchain snapshot
        </chakra.h5>
        <Button
          variant="outline"
          color={LIGHT_COLORS.text.warning}
          borderColor={LIGHT_COLORS.text.warning}
          borderRadius="4rem"
          h="2.2rem"
          hidden={!show}
          _hover={{
            bg: LIGHT_COLORS.hover.warning,
          }}
          _dark={{
            color: DARK_COLORS.text.warning,
            borderColor: DARK_COLORS.text.warning,
            _hover: {
              bg: DARK_COLORS.hover.warning,
            },
          }}
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

export function PageLayout() {
  const {
    data,
    requiredSnapshot,
    updates: { status, ignore, install },
  } = useDataSync()
  const location = useLocation()
  return (
    <>
      <DownloadSnapshotMessage show={requiredSnapshot} data={data} />
      <Flex
        className="App"
        justifyContent="center"
        minHeight={requiredSnapshot ? 'calc(100vh - 3rem)' : '100vh'}
      >
        <Navbar
          top={requiredSnapshot ? '3rem' : '0'}
          height={requiredSnapshot ? 'calc(100vh - 3rem)' : '100vh'}
        />
        <Box w="100%">
          <ScaleFade
            in={true}
            key={location.key}
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              padding: '2.5rem 2rem 0',
              paddingBottom:
                location.pathname === ROUTES.ACCOUNT ? '0' : '2.5rem',
            }}
          >
            <Box
              width="100%"
              height="100%"
              maxWidth={
                location.pathname === ROUTES.ACCOUNT ? '100%' : '65.5rem'
              }
            >
              <Outlet />
            </Box>
          </ScaleFade>
        </Box>
      </Flex>
      {status?.hasUpdates && !status?.ignoreUpdates && (
        <ModalWindow
          isOpen={status?.hasUpdates && !status?.ignoreUpdates}
          onClose={() => ignore()}
        >
          <chakra.h2 mb="1rem">Update Available</chakra.h2>
          <chakra.h4 mb="1.5rem">
            A new version of the Iron Fish app is available, please restart the
            application to apply the update.
          </chakra.h4>
          <Flex>
            <Button
              variant="primary"
              size="medium"
              mr="1.5rem"
              onClick={() => install()}
            >
              Restart Now
            </Button>
            <Link
              alignSelf="center"
              onClick={() => {
                ignore()
              }}
            >
              <h4>Update on Next Launch</h4>
            </Link>
          </Flex>
        </ModalWindow>
      )}
    </>
  )
}

export default PageLayout

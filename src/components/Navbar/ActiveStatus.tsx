import { FC, ReactNode, forwardRef, useState } from 'react'
import {
  chakra,
  Flex,
  FlexProps,
  useColorModeValue,
  Tooltip,
  useBreakpointValue,
  Button,
  Modal,
  ModalProps,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  NAMED_COLORS,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@ironfish/ui-kit'
import { WarningIcon } from '@chakra-ui/icons'
import sizeFormat from 'byte-size'
import { useDataSync, DataSyncContextProps } from 'Providers/DataSyncProvider'
import ConfirmedIcon from 'Svgx/ConfirmedIcon'
import useSnapshotManifest from 'Hooks/snapshot/useSnapshotManifest'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import {
  ProgressStatus,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'
import { useSnapshotStatus } from 'Providers/SnapshotProvider'

const LIGHT_COLORS = {
  text: {
    default: '#335A48',
    warning: '#7E7400',
    danger: '#F15929',
  },
  bg: {
    default: '#EBFBF4',
    warning: '#FFF9BC',
    danger: '#FFE2D9',
  },
}

const DARK_COLORS = {
  text: {
    default: '#5FC89A',
    warning: '#FFF9BC',
    danger: '#F15929',
  },
  bg: {
    default: '#192D23',
    warning: '#444123',
    danger: '#FFE2D9',
  },
}

const getWalletSyncStatus = (
  status: 'stopped' | 'idle' | 'stopping' | 'syncing'
) => {
  switch (status) {
    case 'stopped':
      return 'Stopped'
    case 'idle':
      return 'Idle'
    case 'stopping':
      return 'Stopping'
    case 'syncing':
      return 'Syncing'
    default:
      return 'Idle'
  }
}

const getSnapshotStatus = (status: ProgressStatus) => {
  switch (status) {
    case ProgressStatus.DOWLOADING:
      return 'Downloading'
    case ProgressStatus.DOWNLOADED:
      return 'Preparing'
    case ProgressStatus.CLEARING_CHAIN_DB:
    case ProgressStatus.UNARHIVING:
      return 'Applying'
    case ProgressStatus.CLEARING_TEMP_DATA:
      return 'Clearing'
    default:
      return '-'
  }
}

const DELIMETERS = [
  {
    unit: 's',
    value: 60,
  },
  {
    unit: 'm',
    value: 60,
  },
  {
    unit: 'h',
    value: 24,
  },
]

const renderTime = (time: number) => {
  if (!time) {
    return '...'
  }
  let remaining = time
  const result = []
  let index = 0
  while (remaining > 0) {
    result.push(
      `${Math.floor(remaining % DELIMETERS[index].value)}${
        DELIMETERS[index].unit
      }`
    )
    remaining = Math.floor(remaining / DELIMETERS[index].value)

    if (index === 2 && remaining > 0) {
      result.push(`${remaining}d`)
      break
    } else {
      index++
    }
  }

  return result.reverse().join(' ')
}

const DownloadModal: FC<
  Omit<ModalProps, 'children'> & {
    manifest: SnapshotManifest
    size: string
    estimateTime: string
    onConfirm: () => void
  }
> = ({ size, estimateTime, onConfirm, manifest, ...props }) => {
  const { status, checkPath, start } = useSnapshotStatus()
  const [error, setError] = useState(null)
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Modal {...props}>
      <ModalOverlay background="rgba(0,0,0,0.75)" />
      <ModalContent p="4rem" minW="40rem">
        <ModalHeader>
          <chakra.h2>Download Snapshot</chakra.h2>
        </ModalHeader>
        <ModalCloseButton
          color={NAMED_COLORS.GREY}
          borderRadius="50%"
          borderColor={NAMED_COLORS.LIGHT_GREY}
          border="0.0125rem solid"
          mt="1.5rem"
          mr="1.5rem"
        />
        <ModalBody>
          <chakra.h4>
            You need to download our chain snapshot as the normal download time
            could take up to {estimateTime}. The snapshot will be 2 times faster
            and only {size}. If you need help, please click here.
          </chakra.h4>
          {error && <chakra.h4 color={colors.text.danger}>{error}</chakra.h4>}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            borderRadius="4rem"
            onClick={async () => {
              const path = await window.selectFolder()
              const check = await checkPath(manifest, path)
              if (check.hasError) {
                setError(check.error)
                return
              }

              start(path)
              onConfirm()
            }}
          >
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const SnapshotMessage: FC<{
  data: NodeStatusResponse | undefined
  onDownload: () => void
  isMinified: boolean
}> = ({ data, onDownload }) => {
  const [open, setOpen] = useState(false)
  const [manifest] = useSnapshotManifest()
  return (
    <>
      <WarningIcon
        display={{ base: 'inherit', sm: 'none' }}
        color="inherit"
        w="1.25rem"
        h="0.9375rem"
        onClick={() => setOpen(true)}
      />
      <chakra.h5
        color="inherit"
        m="0.5rem"
        display={{ base: 'none', sm: 'inherit' }}
      >
        You’re required to download our blockchain snapshot
        <chakra.span display={{ base: 'block', sm: 'none' }}>
          Click on icon to download
        </chakra.span>
      </chakra.h5>
      <Button
        variant="outline"
        color="inherit"
        borderColor="inherit"
        borderRadius="4rem"
        mb="1rem"
        display={{ base: 'none', sm: 'inline-flex' }}
        onClick={() => setOpen(true)}
      >
        <chakra.h5 color="inherit">Download Snapshot</chakra.h5>
      </Button>
      <DownloadModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onDownload()
          setOpen(false)
        }}
        size={sizeFormat(manifest?.file_size).toString()}
        estimateTime={formatRemainingTime(
          ((Number(data?.blockchain?.totalSequences || 0) -
            Number(data?.blockchain?.head || 0)) *
            1000) /
            (data?.blockSyncer?.syncing?.speed || 1)
        )}
        manifest={manifest}
      />
    </>
  )
}

const DownloadStatus = () => {
  const { status, checkPath, start, apply } = useSnapshotStatus()
  return (
    <>
      <chakra.h5 color="inherit">
        Status: {getSnapshotStatus(status?.status)}
      </chakra.h5>
      {status &&
        status?.status > ProgressStatus.NOT_STARTED &&
        status?.status < ProgressStatus.COMPLETED && (
          <>
            <chakra.h5 color="inherit">
              {`${(status.current / status.total) * 100}%`}
              {' | '}
              {`${formatRemainingTime(status.estimate)}`}
            </chakra.h5>
            <chakra.h5 color="inherit">
              {sizeFormat(status.current).toString()}
              {' / '}
              {sizeFormat(status.total).toString()}
            </chakra.h5>
          </>
        )}
    </>
  )
}

const SyncStatus: FC<DataSyncContextProps> = ({ data, synced }) => (
  <>
    <chakra.h5 color="inherit">
      Wallet Status: {getWalletSyncStatus(data?.blockSyncer.status)}
    </chakra.h5>
    {!synced &&
      data?.blockSyncer.status !== 'stopped' &&
      (data?.blockSyncer.status === 'syncing' ||
        data?.blockSyncer.status === 'idle') && (
        <>
          <chakra.h5 color="inherit">
            {`${(data?.blockSyncer.syncing.progress * 100).toFixed(2)}%`}
            {' | '}
            {`${renderTime(
              (Number(data?.blockchain?.totalSequences || 0) -
                Number(data?.blockchain?.head || 0)) /
                (data?.blockSyncer?.syncing?.speed || 1)
            )}`}
          </chakra.h5>
          <chakra.h5 color="inherit">
            {`${data?.blockchain.head}`}
            {' / '}
            {`${data?.blockchain.totalSequences}`}
            {' blocks'}
          </chakra.h5>
        </>
      )}
  </>
)

const MiningStatus = forwardRef<HTMLHeadElement>((props, ref) => (
  <chakra.h5 color="inherit">Miner Running: 300 h/s</chakra.h5>
))

interface StatusItemProps extends Omit<FlexProps, 'style' | 'children'> {
  style?: 'default' | 'warning' | 'danger'
  children: (isMinified: boolean) => ReactNode
}

const StatusItemContent = forwardRef<
  HTMLDivElement,
  { isMinified?: boolean } & StatusItemProps
>(({ isMinified = false, style = 'default', children, ...props }, ref) => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Flex
      ref={ref}
      p="0.25rem"
      bgColor={colors.bg[style]}
      borderRadius="0.25rem"
      h={isMinified ? '2.75rem' : 'auto'}
      minH="2.125rem"
      width={isMinified ? '2.75rem' : '14.5rem'}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      flexDirection={isMinified ? 'row' : 'column'}
      _hover={{
        border: isMinified ? `0.0625rem solid ${colors.text[style]}` : 'none',
      }}
      borderColor={colors.text[style]}
      color={colors.text[style]}
      {...props}
    >
      {children(isMinified)}
    </Flex>
  )
})

const StatusItem: FC<StatusItemProps> = ({
  style = 'default',
  children,
  ...props
}) => {
  const small = useBreakpointValue({ base: true, sm: false })
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Tooltip
      label={
        <StatusItemContent style={style} {...props}>
          {isMinified => children(isMinified)}
        </StatusItemContent>
      }
      isDisabled={!small}
      placement="right"
      backgroundColor="transparent !important"
      boxShadow="none"
      offset={[0, 16]}
      p={0}
      m={0}
      border={`0.0625rem solid ${colors.text[style]}`}
    >
      <StatusItemContent isMinified={small} style={style} {...props}>
        {isMinified => children(isMinified)}
      </StatusItemContent>
    </Tooltip>
  )
}

const ActiveStatus: FC<FlexProps> = props => {
  const { synced, data, requiredSnapshot, sync } = useDataSync()
  const [download, setDownload] = useState(false)
  return (
    <Flex
      my={{ base: 0, sm: '1.5rem' }}
      flexDirection="column"
      alignItems="center"
      gap="0.375rem"
      {...props}
    >
      <StatusItem display={download ? 'flex' : 'none'} style="warning">
        {() => <DownloadStatus />}
      </StatusItem>
      <StatusItem
        display={requiredSnapshot && !download ? 'flex' : 'none'}
        style="danger"
      >
        {isMinified => (
          <SnapshotMessage
            isMinified={isMinified}
            data={data}
            onDownload={() => setDownload(true)}
          />
        )}
      </StatusItem>
      <StatusItem
        display={requiredSnapshot || download ? 'none' : 'flex'}
        style={synced ? 'default' : 'warning'}
      >
        {isMinified =>
          isMinified ? (
            synced ? (
              <ConfirmedIcon color="inherit" w="1.25rem" h="0.9375rem" />
            ) : (
              <chakra.h6 mt="0.0625rem" color="inherit">
                {Math.floor(data?.blockSyncer.syncing.progress * 100)}%
              </chakra.h6>
            )
          ) : (
            <SyncStatus data={data} synced={synced} sync={sync} />
          )
        }
      </StatusItem>
      <StatusItem display="none">
        {isMinified =>
          isMinified ? (
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <chakra.h6 mb="-0.4375rem">300</chakra.h6>
              <chakra.h6 mb="-0.1875rem">h\s</chakra.h6>
            </Flex>
          ) : (
            <MiningStatus />
          )
        }
      </StatusItem>
    </Flex>
  )
}

export default ActiveStatus

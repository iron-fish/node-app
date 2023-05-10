import { Button, chakra } from '@ironfish/ui-kit'
import SnapshotStatusModal from 'Components/Snapshot/SnapshotStatusModal'
import { FC, useState } from 'react'
import {
  SnapshotProgressStatus,
  SnapshotProgressType,
} from 'Types/IronfishManager/IIronfishSnapshotManager'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'
import sizeFormat from 'byte-size'

const getSnapshotStatus = (status: SnapshotProgressStatus) => {
  switch (status) {
    case SnapshotProgressStatus.DOWNLOADING:
      return 'Downloading'
    case SnapshotProgressStatus.DOWNLOADED:
      return 'Preparing'
    case SnapshotProgressStatus.CLEARING_CHAIN_DB:
    case SnapshotProgressStatus.UNARHIVING:
      return 'Applying'
    case SnapshotProgressStatus.CLEARING_TEMP_DATA:
      return 'Clearing'
    default:
      return '-'
  }
}

const SnapshotStatus: FC<{
  status: Omit<SnapshotProgressType, 'statistic'>
  isMinified: boolean
}> = ({ status, isMinified }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <chakra.h6
        mt="0.0625rem"
        color="inherit"
        display={isMinified ? 'inherit' : 'none'}
        onClick={() => setOpen(true)}
      >
        {Math.floor(((status?.current || 0) / (status?.total || 1)) * 100)}%
      </chakra.h6>
      <chakra.h5 color="inherit" display={isMinified ? 'none' : 'inherit'}>
        Status: {getSnapshotStatus(status?.status)}
      </chakra.h5>
      {status &&
        status?.status > SnapshotProgressStatus.NOT_STARTED &&
        status?.status < SnapshotProgressStatus.COMPLETED && (
          <>
            <chakra.h5
              color="inherit"
              display={isMinified ? 'none' : 'inherit'}
            >
              {`${((status.current / status.total) * 100).toFixed(2)}%`}
              {' | '}
              {`${formatRemainingTime(status.estimate, 1)}`}
            </chakra.h5>
            <chakra.h5
              color="inherit"
              display={isMinified ? 'none' : 'inherit'}
            >
              {sizeFormat(status.current).toString()}
              {' / '}
              {sizeFormat(status.total).toString()}
            </chakra.h5>
            <Button
              borderRadius="4rem"
              variant="outline"
              color="inherit"
              borderColor="inherit"
              h="2rem"
              w="75%"
              my="0.25rem"
              onClick={() => setOpen(true)}
              display={{ base: 'none', sm: 'inherit' }}
              _hover={{
                bg: 'var(--statusbar-hover-color)',
              }}
            >
              Details
            </Button>
          </>
        )}
      <SnapshotStatusModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default SnapshotStatus

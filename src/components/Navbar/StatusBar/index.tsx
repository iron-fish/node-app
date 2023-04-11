import {
  chakra,
  ConfirmedIcon,
  Flex,
  FlexProps,
  useBreakpointValue,
} from '@ironfish/ui-kit'
import { useDataSync } from 'Providers/DataSyncProvider'
import { useSnapshotStatus } from 'Providers/SnapshotProvider'
import { FC, useMemo } from 'react'
import { ProgressStatus } from 'Types/IronfishManager/IIronfishSnapshotManager'
import MiningStatus from './MiningStatus'
import SnapshotRequirement from './SnapshotRequirement'
import SnapshotStatus from './SnapshotStatus'
import { StatusItem } from './StatusItem'
import WalletSyncStatus from './WalletSyncStatus'

const ActiveStatus: FC<FlexProps> = props => {
  const { synced, data, requiredSnapshot, sync } = useDataSync()
  const { status } = useSnapshotStatus()
  const small = useBreakpointValue({ base: true, sm: false })
  const download = useMemo(
    () =>
      status?.status > ProgressStatus.NOT_STARTED &&
      status?.status < ProgressStatus.COMPLETED,
    [status?.status]
  )
  return (
    <Flex
      my={{ base: 0, sm: '1rem' }}
      flexDirection="column"
      alignItems="center"
      gap="0.375rem"
      {...props}
    >
      <StatusItem
        display={download ? 'flex' : 'none'}
        style="warning"
        TooltipProps={{
          isDisabled: small ? status?.status > ProgressStatus.DOWNLOADED : true,
        }}
      >
        {isMinified => (
          <SnapshotStatus status={status} isMinified={isMinified} />
        )}
      </StatusItem>
      <StatusItem
        display={requiredSnapshot && !download ? 'flex' : 'none'}
        style="warning"
      >
        {isMinified => (
          <SnapshotRequirement isMinified={isMinified} data={data} />
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
            <WalletSyncStatus data={data} synced={synced} sync={sync} />
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

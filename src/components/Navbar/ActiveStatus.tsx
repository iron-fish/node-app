import { FC, ReactNode } from 'react'
import {
  chakra,
  Flex,
  FlexProps,
  useColorModeValue,
  Tooltip,
  useBreakpointValue,
} from '@ironfish/ui-kit'
import { useDataSync, DataSyncContextProps } from 'Providers/DataSyncProvider'
import ConfirmedIcon from 'Svgx/ConfirmedIcon'

const LIGHT_COLORS = {
  text: '#335A48',
  textWarn: '#7E7400',
  bg: '#EBFBF4',
  bgWarn: '#FFF9BC',
}

const DARK_COLORS = {
  text: '#5FC89A',
  textWarn: '#FFF9BC',
  bg: '#192D23',
  bgWarn: '#444123',
}

const getWalletSyncStatus = (
  status: 'stopped' | 'idle' | 'stopping' | 'syncing'
) => {
  switch (status) {
    case 'stopped':
      return 'Stropped'
    case 'idle':
      return 'Synced'
    case 'stopping':
      return 'Stopping'
    case 'syncing':
      return 'Syncing'
    default:
      return 'Syncing'
  }
}

function round(value: number, places: number): number {
  const scalar = Math.pow(10, places)
  return Math.round(value * scalar) / scalar
}

const MS_PER_SEC = 1000.0
const MS_PER_MIN = 60.0 * 1000.0
const MS_PER_HOUR = 60.0 * 60.0 * 1000.0

const renderTime = (
  time: number,
  options?: {
    forceHour?: boolean
    forceMinute?: boolean
    forceSecond?: boolean
    forceMillisecond?: boolean
    hideMilliseconds?: boolean
  }
): string => {
  if (time < 1) {
    return `${round(time, 4)}ms`
  }

  const parts = []
  let magnitude = 0

  if (time >= MS_PER_HOUR && (magnitude <= 5 || options?.forceHour)) {
    const hours = Math.floor(time / MS_PER_HOUR)
    time -= hours * MS_PER_HOUR
    parts.push(`${hours.toFixed(0)}h`)
    magnitude = Math.max(magnitude, 4)
  }

  if (time >= MS_PER_MIN && (magnitude <= 4 || options?.forceMinute)) {
    const minutes = Math.floor(time / MS_PER_MIN)
    time -= minutes * MS_PER_MIN
    parts.push(`${minutes.toFixed(0)}m`)
    magnitude = Math.max(magnitude, 3)
  }

  if (time >= MS_PER_SEC && (magnitude <= 3 || options?.forceSecond)) {
    const seconds = Math.floor(time / MS_PER_SEC)
    time -= seconds * MS_PER_SEC
    parts.push(`${seconds.toFixed(0)}s`)
    magnitude = Math.max(magnitude, 2)
  }

  if (time > 0 && (magnitude <= 2 || options?.forceMillisecond)) {
    if (!options?.hideMilliseconds) {
      if (magnitude === 0) {
        parts.push(`${round(time, 4)}ms`)
      } else {
        parts.push(`${time.toFixed(0)}ms`)
      }
    }
    magnitude = Math.max(magnitude, 1)
  }

  return parts.join(' ')
}

const SyncStatus: FC<DataSyncContextProps> = ({ data, loaded }) => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Flex
      p="0.25rem"
      bg={loaded ? colors.bg : colors.bgWarn}
      borderRadius="0.25rem"
      textAlign="center"
      flexDirection="column"
      width="14.5rem"
      minH="2.125rem"
      justifyContent="center"
    >
      <chakra.h5 color={loaded ? colors.text : colors.textWarn}>
        Wallet Status: {getWalletSyncStatus(data?.blockSyncer.status)}
      </chakra.h5>
      {!loaded && (
        <>
          <chakra.h5 color={colors.textWarn}>
            {`${(data?.blockSyncer.syncing.progress * 100).toFixed(2)}%`}
            {' | '}
            {`${renderTime(Date.now() - data?.blockchain.headTimestamp)}`}
          </chakra.h5>
          <chakra.h5 color={colors.textWarn}>
            {`${data?.blockchain.head}`}
            {' / '}
            {`${data?.blockchain.totalSequences}`}
            {' blocks'}
          </chakra.h5>
        </>
      )}
    </Flex>
  )
}

const MiningStatus = () => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Flex
      p="0.25rem"
      bg={colors.bg}
      borderRadius="0.25rem"
      h="2.125rem"
      width="14.5rem"
      alignItems="center"
      justifyContent="center"
    >
      <chakra.h5 color={colors.text}>Miner Running: 300 h/s</chakra.h5>
    </Flex>
  )
}

interface StatusItemProps {
  fullSize: ReactNode
  minified: ReactNode
  loaded: boolean
}

const StatusItem: FC<StatusItemProps> = ({ fullSize, minified, loaded }) => {
  const small = useBreakpointValue({ base: true, sm: false })
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Tooltip
      label={fullSize}
      isDisabled={!small}
      placement="right"
      backgroundColor="transparent !important"
      boxShadow="none"
      offset={[0, 16]}
      p={0}
      m={0}
      border={`0.0625rem solid ${loaded ? colors.text : colors.textWarn}`}
    >
      {small ? (
        <Flex
          bgColor={loaded ? colors.bg : colors.bgWarn}
          p="0.25rem"
          borderRadius="0.25rem"
          h="2.125rem"
          width="2.125rem"
          alignItems="center"
          justifyContent="center"
          _hover={{
            border: `0.0625rem solid ${loaded ? colors.text : colors.textWarn}`,
          }}
          color={loaded ? colors.text : colors.textWarn}
        >
          {minified}
        </Flex>
      ) : (
        fullSize
      )}
    </Tooltip>
  )
}

const ActiveStatus: FC<FlexProps> = props => {
  const { loaded, data } = useDataSync()
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Flex
      my={{ base: 0, sm: '1.5rem' }}
      flexDirection="column"
      alignItems="center"
      gap="0.375rem"
      {...props}
    >
      <StatusItem
        loaded={loaded}
        fullSize={<SyncStatus data={data} loaded={loaded} />}
        minified={
          loaded ? (
            <ConfirmedIcon color={colors.text} w="20px" h="15px" />
          ) : (
            <chakra.h6 mt="0.0625rem">
              {(data?.blockSyncer.syncing.progress * 100).toFixed(0)}%
            </chakra.h6>
          )
        }
      />
      <StatusItem
        loaded={true}
        fullSize={<MiningStatus />}
        minified={
          <Flex direction="column" alignItems="center" justifyContent="center">
            <chakra.h6 mb="-0.4375rem">300</chakra.h6>
            <chakra.h6 mb="-0.1875rem">h\s</chakra.h6>
          </Flex>
        }
      />
    </Flex>
  )
}

export default ActiveStatus

import { FC, ReactNode, forwardRef } from 'react'
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

const SyncStatus = forwardRef<HTMLDivElement, DataSyncContextProps>(
  ({ data, loaded }, ref) => {
    const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
    return (
      <Flex
        ref={ref}
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
              {`${(data?.blockSyncer.syncing.progress * 100).toFixed(0)}%`}
              {' | '}
              {`${(data?.blockSyncer.syncing.blockSpeed / 1000).toFixed(0)}`}
              {' seconds'}
            </chakra.h5>
            <chakra.h5 color={colors.textWarn}>
              {`${Math.floor(
                data?.blockSyncer.syncing.progress *
                  data?.blockSyncer.syncing.speed *
                  100
              ).toLocaleString()}`}
              {' / '}
              {`${(data?.blockSyncer.syncing.speed * 100).toLocaleString()}`}
              {' blocks'}
            </chakra.h5>
          </>
        )}
      </Flex>
    )
  }
)

const MiningStatus = forwardRef<HTMLDivElement>((props, ref) => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Flex
      ref={ref}
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
})

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
          h="2.75rem"
          width="2.75rem"
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

const ActiveStats: FC<FlexProps> = props => {
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
            <ConfirmedIcon color={colors.text} w="1.25rem" h="0.9375rem" />
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

export default ActiveStats
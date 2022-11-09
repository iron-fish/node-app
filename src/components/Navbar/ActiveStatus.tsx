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
    return null
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

const NodeStatus: FC<DataSyncContextProps> = ({ data, loaded }) => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  let remaining
  if (Number(data?.blockchain.head) < Number(data?.blockchain.totalSequences)) {
    if (Number(data?.blockSyncer.syncing.speed) > 0) {
      remaining =
        renderTime(
          (Number(data?.blockchain.totalSequences) -
            Number(data?.blockchain.head)) /
            Number(data?.blockSyncer.syncing.speed)
        ) + ' remaining'
    }
  }
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
        Node: {loaded ? 'Connected' : 'Downloading'}
      </chakra.h5>
      {!loaded && (
        <>
          <chakra.h5 color={colors.textWarn}>
            {`${data?.blockchain.head}`}
            {' / '}
            {`${data?.blockchain.totalSequences}`}
            {' blocks'}
          </chakra.h5>
          <chakra.h5 color={colors.textWarn}>{remaining}</chakra.h5>
        </>
      )}
    </Flex>
  )
}

const WalletStatus: FC<DataSyncContextProps> = ({ data, loaded }) => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  let remaining
  if (Number(data?.blockchain.head) < Number(data?.blockchain.totalSequences)) {
    if (Number(data?.blockSyncer.syncing.speed) > 0) {
      remaining =
        renderTime(
          (Number(data?.blockchain.totalSequences) -
            Number(data?.blockchain.head)) /
            Number(data?.blockSyncer.syncing.speed)
        ) + ' remaining'
    }
  }
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
        Wallet: {loaded ? 'Synced' : 'Syncing'}
      </chakra.h5>
      {!loaded && (
        <>
          <chakra.h5 color={colors.textWarn}>
            {`${data?.blockchain.head}`}
            {' / '}
            {`${data?.blockchain.totalSequences}`}
            {' blocks'}
          </chakra.h5>
          <chakra.h5 color={colors.textWarn}>{remaining}</chakra.h5>
        </>
      )}
    </Flex>
  )
}

// const MiningStatus = () => {
//   const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
//   return (
//     <Flex
//       p="0.25rem"
//       bg={colors.bg}
//       borderRadius="0.25rem"
//       h="2.125rem"
//       width="14.5rem"
//       alignItems="center"
//       justifyContent="center"
//     >
//       <chakra.h5 color={colors.text}>Miner Running: 300 h/s</chakra.h5>
//     </Flex>
//   )
// }

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
        fullSize={<NodeStatus data={data} loaded={loaded} />}
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
        fullSize={<WalletStatus data={data} loaded={loaded} />}
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
    </Flex>
  )
}

export default ActiveStatus

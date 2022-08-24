import { FC, ReactNode } from 'react'
import {
  Box,
  BoxProps,
  chakra,
  Flex,
  HStack,
  LightMode,
  NAMED_COLORS,
  Skeleton,
  SkeletonText,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  VStack,
} from '@ironfish/ui-kit'
import useNodeStatus from 'Hooks/node/useNodeStatus'
import NodeOverviewImage from 'Svgx/NodeOverviewImage'

interface NodeStatProps {
  isLoaded: boolean
  label: ReactNode
  value: ReactNode
}

const NodeStat: FC<NodeStatProps> = ({ isLoaded, label, value }) => (
  <Stat>
    <StatLabel>
      <chakra.h6 color="#9B7641">{label}</chakra.h6>
    </StatLabel>
    <Skeleton
      isLoaded={isLoaded}
      minW="6rem"
      minH="2.4rem"
      startColor="#F3C174"
      endColor="#F1B75E"
    >
      <StatNumber>
        <chakra.h3 textTransform="capitalize">{value}</chakra.h3>
      </StatNumber>
    </Skeleton>
  </Stat>
)

const NodeStatus: FC<BoxProps> = props => {
  const { loaded, data, error } = useNodeStatus()
  return (
    <Box
      p="4rem"
      layerStyle="card"
      bg={`${NAMED_COLORS.LIGHT_YELLOW} !important`}
      color={NAMED_COLORS.DEEP_BLUE}
      h="20rem"
      overflow="hidden"
      whiteSpace="nowrap"
      {...props}
    >
      <LightMode>
        <Box marginTop="-2rem" h="14rem">
          <NodeOverviewImage width="calc(60%)" height="auto" marginLeft="40%" />
        </Box>
        <Flex marginTop="-12rem">
          <Box minW="18.75rem" h="12rem" mr="2rem" overflow="visible">
            <Skeleton
              isLoaded={loaded}
              mb="1rem"
              minW="10rem"
              h="2.4rem"
              startColor="#F3C174"
              endColor="#F1B75E"
            >
              <chakra.h3 mb="1rem">{data?.node.nodeName}</chakra.h3>
            </Skeleton>
            <HStack spacing="2rem">
              <VStack spacing="1rem" align="flex-start">
                <NodeStat
                  isLoaded={loaded}
                  label="Connected Peers"
                  value={<>{data?.peerNetwork.peers}</>}
                />
                <NodeStat
                  isLoaded={loaded}
                  label="Status"
                  value={<>{data?.node.status}</>}
                />
              </VStack>
              <VStack spacing="1rem" align="flex-start">
                <NodeStat
                  isLoaded={loaded}
                  label="Outgoing"
                  value={
                    <>
                      {data?.peerNetwork.outboundTraffic.toFixed(2)}&nbsp;
                      <chakra.span textTransform="lowercase">kb/s</chakra.span>
                    </>
                  }
                />
                <NodeStat
                  isLoaded={loaded}
                  label="Incoming"
                  value={
                    <>
                      {data?.peerNetwork.inboundTraffic.toFixed(2)}&nbsp;
                      <chakra.span textTransform="lowercase">kb/s</chakra.span>
                    </>
                  }
                />
              </VStack>
            </HStack>
          </Box>
        </Flex>
      </LightMode>
    </Box>
  )
}

export default NodeStatus

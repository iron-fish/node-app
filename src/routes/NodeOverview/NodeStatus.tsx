import { FC, ReactNode } from 'react'
import {
  Box,
  BoxProps,
  chakra,
  Flex,
  HStack,
  NAMED_COLORS,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  LightMode,
  CopyValueToClipboard,
} from '@ironfish/ui-kit'
import NodeOverviewImage from 'Svgx/NodeOverviewImage'
import { FileUtils } from '@ironfish/sdk/build/src/utils/file'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import useNodeStatus from 'Hooks/node/useNodeStatus'
import { truncateHash } from 'Utils/hash'

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

interface NodeStatusProps extends BoxProps {
  pauseTracking: boolean
}

const NodeStatus: FC<NodeStatusProps> = ({ pauseTracking, ...props }) => {
  const { loaded, data, error } = useNodeStatus(pauseTracking)

  return (
    <Box
      p="4rem"
      ml="0 !important"
      layerStyle="card"
      bg={`${NAMED_COLORS.LIGHT_YELLOW} !important`}
      color={NAMED_COLORS.DEEP_BLUE}
      h="18.75rem"
      overflow="hidden"
      whiteSpace="nowrap"
      borderRadius="0.25rem"
      {...props}
    >
      <LightMode>
        <Flex marginTop="-2rem" h="14rem">
          <NodeOverviewImage
            width={{ base: '18.125rem', md: '33.25rem' }}
            height={{ base: '17.5rem', md: '32.1875rem' }}
            mr={{ base: '-7.5rem', md: '-10.3125rem' }}
            mt={{ base: '-1.4375rem', md: 0 }}
            ml="auto"
          />
        </Flex>
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
            <HStack spacing="4rem">
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
                      <chakra.span textTransform="lowercase">
                        {FileUtils.formatFileSize(
                          data?.peerNetwork.outboundTraffic
                        )}
                      </chakra.span>
                      <chakra.span textTransform="lowercase">/s</chakra.span>
                    </>
                  }
                />
                <NodeStat
                  isLoaded={loaded}
                  label="Incoming"
                  value={
                    <>
                      <chakra.span textTransform="lowercase">
                        {FileUtils.formatFileSize(
                          data?.peerNetwork.inboundTraffic
                        )}
                      </chakra.span>
                      <chakra.span textTransform="lowercase">/s</chakra.span>
                    </>
                  }
                />
              </VStack>
              <VStack spacing="1rem" align="flex-start">
                <NodeStat
                  isLoaded={loaded}
                  label="Head Hash"
                  value={
                    <Flex>
                      <chakra.span textTransform="lowercase">
                        ...{truncateHash(data?.blockchain.headHash, 1)}
                      </chakra.span>
                      <CopyValueToClipboard
                        label=""
                        labelProps={{
                          as: 'h5',
                        }}
                        value={data?.blockchain.headHash}
                        copyTooltipText="Copy to clipboard"
                        copiedTooltipText="Copied"
                        containerProps={{
                          color: NAMED_COLORS.GREY,
                          _dark: {
                            color: NAMED_COLORS.PALE_GREY,
                          },
                        }}
                      />
                    </Flex>
                  }
                />
                <NodeStat
                  isLoaded={loaded}
                  label="Head Sequence"
                  value={
                    <>
                      <chakra.span textTransform="lowercase">
                        {data?.blockchain.head}
                      </chakra.span>
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

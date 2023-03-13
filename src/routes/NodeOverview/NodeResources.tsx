import { FC, ReactNode } from 'react'
import {
  Flex,
  chakra,
  StatLabel,
  StatNumber,
  Stat,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import { FileUtils } from '@ironfish/sdk/build/src/utils/file'
import NodeStatusResponse from 'Types/NodeStatusResponse'

interface NodeResourceProps {
  label: ReactNode
  value: ReactNode
}

const NodeResource: FC<NodeResourceProps> = ({ label, value }) => (
  <Stat minW="14.375rem">
    <StatLabel>
      <chakra.h6 color="#9B7641">{label}</chakra.h6>
    </StatLabel>
    <StatNumber>
      <chakra.h3 textTransform="capitalize">{value}</chakra.h3>
    </StatNumber>
  </Stat>
)

interface NodeResourcesProps {
  data: NodeStatusResponse
  loaded: boolean
}

const NodeResources: FC<NodeResourcesProps> = ({ data, loaded }) => {
  const heapTotal = FileUtils.formatMemorySize(data?.memory.heapTotal)
  const heapUsed = FileUtils.formatMemorySize(data?.memory.heapUsed)
  const heapMax = FileUtils.formatMemorySize(data?.memory.heapMax)
  const rss = FileUtils.formatMemorySize(data?.memory.rss)
  const memFree = FileUtils.formatMemorySize(data?.memory.memFree)

  return (
    loaded && (
      <Flex direction="column">
        <Flex
          p="4rem"
          ml="0 !important"
          layerStyle="card"
          bg={`${NAMED_COLORS.LIGHT_YELLOW} !important`}
          color={NAMED_COLORS.DEEP_BLUE}
          overflow="hidden"
          whiteSpace="nowrap"
          borderRadius="0.25rem"
          direction="column"
          gap="1rem"
        >
          <h3>Node Resources</h3>
          <Flex
            w="100%"
            wrap="wrap"
            mb="2.25rem"
            alignItems="space-between"
            justifyContent="space-between"
            gap="1rem"
          >
            <NodeResource label="Cores" value={data.cpu.cores} />
            <NodeResource
              label="Current"
              value={`${data.cpu.percentCurrent.toFixed(1)}%`}
            />
            <NodeResource
              label="RSS"
              value={`${rss} (${(
                (data.memory.rss / data.memory.memTotal) *
                100
              ).toFixed(1)}%)`}
            />
            <NodeResource
              label="Free"
              value={`${memFree} (${(
                (1 - data.memory.memFree / data.memory.memTotal) *
                100
              ).toFixed(1)}
              %)`}
            />
            <NodeResource label="Heap used" value={heapUsed} />
            <NodeResource label="Heap total" value={heapTotal} />
            <NodeResource
              label="Heap maximum"
              value={`${heapMax} (${(
                (data.memory.heapUsed / data.memory.heapMax) *
                100
              ).toFixed(1)}%)`}
            />
          </Flex>
        </Flex>
      </Flex>
    )
  )
}

export default NodeResources

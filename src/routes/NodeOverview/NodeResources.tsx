import { FC, ReactNode } from 'react'
import {
  Flex,
  chakra,
  StatLabel,
  StatNumber,
  Stat,
  Wrap,
  WrapItem,
} from '@ironfish/ui-kit'
import { FileUtils } from '@ironfish/sdk/build/src/utils/file'
import NodeStatusResponse from 'Types/NodeStatusResponse'

interface NodeResourceProps {
  label: ReactNode
  value: ReactNode
}

const NodeResource: FC<NodeResourceProps> = ({ label, value }) => (
  <Stat>
    <StatLabel>
      <chakra.h6>{label}</chakra.h6>
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
          overflow="hidden"
          whiteSpace="nowrap"
          borderRadius="0.25rem"
          direction="column"
          gap="1rem"
        >
          <Wrap spacing="2rem" width="100%">
            <WrapItem>
              <NodeResource label="Cores" value={data.cpu.cores} />
            </WrapItem>
            <WrapItem>
              <NodeResource
                label="Current"
                value={`${data.cpu.percentCurrent.toFixed(1)}%`}
              />
            </WrapItem>
          </Wrap>
          <Wrap spacing="2rem" width="100%">
            <WrapItem>
              <NodeResource
                label="RSS"
                value={`${rss} (${(
                  (data.memory.rss / data.memory.memTotal) *
                  100
                ).toFixed(1)}%)`}
              />
            </WrapItem>
            <WrapItem>
              <NodeResource
                label="Free"
                value={`${memFree} (${(
                  (1 - data.memory.memFree / data.memory.memTotal) *
                  100
                ).toFixed(1)}
              %)`}
              />
            </WrapItem>
          </Wrap>
          <Wrap spacing="2rem" width="100%">
            <WrapItem>
              <NodeResource label="Heap used" value={heapUsed} />
            </WrapItem>
            <WrapItem>
              <NodeResource label="Heap total" value={heapTotal} />
            </WrapItem>
            <WrapItem>
              <NodeResource
                label="Heap maximum"
                value={`${heapMax} (${(
                  (data.memory.heapUsed / data.memory.heapMax) *
                  100
                ).toFixed(1)}%)`}
              />
            </WrapItem>
          </Wrap>
        </Flex>
      </Flex>
    )
  )
}

export default NodeResources

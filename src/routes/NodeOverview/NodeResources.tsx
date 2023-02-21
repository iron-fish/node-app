import { FC } from 'react'
import { Flex, FieldGroup, TextField, chakra } from '@ironfish/ui-kit'
import { FileUtils } from '@ironfish/sdk/build/src/utils/file'
import NodeStatusResponse from 'Types/NodeStatusResponse'

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
        <chakra.h3>CPU</chakra.h3>
        <FieldGroup mb="1rem">
          <TextField
            label="Cores"
            value={`${data.cpu.cores}`}
            width="50%"
            InputProps={{ isReadOnly: true }}
          />
          <TextField
            label="Current"
            value={`${data.cpu.percentCurrent.toFixed(1)}%`}
            width="50%"
            InputProps={{ isReadOnly: true }}
          />
        </FieldGroup>
        <chakra.h3>Memory</chakra.h3>
        <FieldGroup mb="1rem">
          <TextField
            width="33.4%"
            label="Heap used"
            value={`${heapUsed}`}
            InputProps={{ isReadOnly: true }}
          />
          <TextField
            width="33.4%"
            label="Heap total"
            value={`${heapTotal}`}
            InputProps={{ isReadOnly: true }}
          />
          <TextField
            width="33.4%"
            label="Heap maximum"
            value={`${heapMax} (${(
              (data.memory.heapUsed / data.memory.heapMax) *
              100
            ).toFixed(1)}%)`}
            InputProps={{ isReadOnly: true }}
          />
        </FieldGroup>
        <FieldGroup mb="1rem">
          <TextField
            label="RSS"
            value={`${rss} (${(
              (data.memory.rss / data.memory.memTotal) *
              100
            ).toFixed(1)}%)`}
            width="50%"
            InputProps={{ isReadOnly: true }}
          />
          <TextField
            label="Free"
            value={`${memFree} (${(
              (1 - data.memory.memFree / data.memory.memTotal) *
              100
            ).toFixed(1)}%)`}
            width="50%"
            InputProps={{ isReadOnly: true }}
          />
        </FieldGroup>
      </Flex>
    )
  )
}

export default NodeResources

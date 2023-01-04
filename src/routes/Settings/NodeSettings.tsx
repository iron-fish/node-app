import { ConfigOptions } from '@ironfish/sdk'
import { Flex, chakra, TextField, Button, Skeleton } from '@ironfish/ui-kit'
import useNodeSettings from 'Hooks/node/useNodeSettings'
import { FC, useState, useEffect } from 'react'

const NodeSettings: FC = () => {
  const [nodeSettings, setNodeSettings] = useState<Partial<ConfigOptions>>({})
  const [{ data, loaded }, saveSettings] = useNodeSettings()

  useEffect(() => {
    setNodeSettings({ ...data })
  }, [data])

  const updateSettingValue = (key: string, value: any) =>
    setNodeSettings(prev => ({
      ...prev,
      [key]: value,
    }))

  const handleSaveSettings = () => saveSettings(nodeSettings)

  const hasChanges = () => {
    const keys = [
      'nodeName',
      'blockGraffiti',
      'nodeWorkers',
      'minPeers',
      'maxPeers',
      'blocksPerMessage',
    ]

    return !(
      data &&
      nodeSettings &&
      keys.some(
        (key: keyof ConfigOptions) =>
          data[key]?.toString() !== nodeSettings[key]?.toString()
      )
    )
  }

  return (
    <Flex direction="column">
      <chakra.h3>Node Settings</chakra.h3>
      <Skeleton my="1rem" variant="ironFish" isLoaded={loaded}>
        <TextField
          label="Node name"
          value={nodeSettings?.nodeName}
          InputProps={{
            onChange: e => updateSettingValue('nodeName', e.target.value),
          }}
        />
      </Skeleton>
      <Skeleton my="1rem" variant="ironFish" isLoaded={loaded}>
        <TextField
          label="Block graffiti"
          value={nodeSettings?.blockGraffiti}
          InputProps={{
            onChange: e => updateSettingValue('blockGraffiti', e.target.value),
          }}
        />
      </Skeleton>
      <Skeleton my="1rem" variant="ironFish" isLoaded={loaded}>
        <TextField
          label="Node workers"
          value={nodeSettings?.nodeWorkers?.toString()}
          InputProps={{
            type: 'number',
            onChange: e => updateSettingValue('nodeWorkers', e.target.value),
          }}
        />
      </Skeleton>
      <Skeleton my="1rem" variant="ironFish" isLoaded={loaded}>
        <Flex gap="32px">
          <TextField
            label="Min Peers"
            w="50%"
            value={nodeSettings?.minPeers?.toString()}
            InputProps={{
              type: 'number',
              onChange: e => updateSettingValue('minPeers', e.target.value),
            }}
          />
          <TextField
            label="Max peers"
            w="50%"
            value={nodeSettings?.maxPeers?.toString()}
            InputProps={{
              type: 'number',
              onChange: e => updateSettingValue('maxPeers', e.target.value),
            }}
          />
        </Flex>
      </Skeleton>
      <Skeleton variant="ironFish" my="1rem" isLoaded={loaded}>
        <TextField
          label="Blocks Per Message"
          value={nodeSettings?.blocksPerMessage?.toString()}
          InputProps={{
            type: 'number',
            onChange: e =>
              updateSettingValue('blocksPerMessage', e.target.value),
          }}
        />
      </Skeleton>
      <Flex my="1rem" gap="32px">
        <Button
          variant="primary"
          size="large"
          onClick={handleSaveSettings}
          isDisabled={hasChanges()}
        >
          Save settings
        </Button>
      </Flex>
    </Flex>
  )
}

export default NodeSettings

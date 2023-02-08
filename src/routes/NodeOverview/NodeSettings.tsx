import { ConfigOptions } from '@ironfish/sdk'
import {
  Flex,
  chakra,
  TextField,
  Button,
  Skeleton,
  useIronToast,
  Box,
  useColorModeValue,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import useNodeSettings from 'Hooks/node/useNodeSettings'
import { FC, useState, useEffect, memo, useMemo } from 'react'
import pick from 'lodash/pick'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem" mt="1rem">
      <chakra.h3 mb="1rem">Settings</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Change your node settings to fit you needs
      </chakra.h5>
      <AccountSettingsImage />
    </Box>
  )
})

const SETTINGS_KEYS = [
  'nodeName',
  'blockGraffiti',
  'nodeWorkers',
  'minPeers',
  'maxPeers',
  'blocksPerMessage',
]

const NodeSettings: FC = () => {
  const [nodeSettings, setNodeSettings] = useState<Partial<ConfigOptions>>({})
  const {
    data,
    loaded,
    actions: { saveSettings },
  } = useNodeSettings()
  const toast = useIronToast({
    containerStyle: {
      mb: '1rem',
    },
  })

  useEffect(() => {
    setNodeSettings(pick(data, SETTINGS_KEYS))
  }, [data])

  const updateSettingValue = (key: string, value: unknown) =>
    setNodeSettings(prev => ({
      ...prev,
      [key]: value,
    }))

  const handleSaveSettings = () => {
    saveSettings(nodeSettings).then(() => toast({ title: 'Settings saved' }))
  }

  const hasNoChanges = useMemo(
    () =>
      !(
        data &&
        nodeSettings &&
        SETTINGS_KEYS.some(
          (key: keyof ConfigOptions) =>
            data[key]?.toString() !== nodeSettings[key]?.toString()
        )
      ),
    [data, nodeSettings]
  )

  return (
    <Flex>
      <Flex direction="column" w="37.25rem">
        <Flex gap="2rem">
          <Skeleton w="50%" my="1rem" variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Node name"
              value={nodeSettings?.nodeName}
              InputProps={{
                onChange: e => updateSettingValue('nodeName', e.target.value),
              }}
            />
          </Skeleton>
          <Skeleton w="50%" my="1rem" variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Block graffiti"
              value={nodeSettings?.blockGraffiti}
              InputProps={{
                onChange: e =>
                  updateSettingValue('blockGraffiti', e.target.value),
              }}
            />
          </Skeleton>
        </Flex>
        <Skeleton my="1rem" variant="ironFish" isLoaded={!!data}>
          <Flex gap="2rem">
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
        <Flex gap="2rem">
          <Skeleton w="50%" my="1rem" variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Node workers"
              value={nodeSettings?.nodeWorkers?.toString()}
              InputProps={{
                type: 'number',
                onChange: e =>
                  updateSettingValue('nodeWorkers', e.target.value),
              }}
            />
          </Skeleton>
          <Skeleton w="50%" variant="ironFish" my="1rem" isLoaded={!!data}>
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
        </Flex>
        <Flex my="1rem" gap="32px">
          <Button
            variant="primary"
            size="large"
            onClick={handleSaveSettings}
            isDisabled={!loaded || hasNoChanges}
          >
            Save settings
          </Button>
        </Flex>
      </Flex>
      <Box>
        <DetailsPanel>
          <Information />
        </DetailsPanel>
      </Box>
    </Flex>
  )
}

export default NodeSettings

import { ConfigOptions } from '@ironfish/sdk'
import {
  Flex,
  chakra,
  TextField,
  Button,
  Skeleton,
  useIronToast,
  Box,
  NAMED_COLORS,
  Grid,
} from '@ironfish/ui-kit'
import useNodeSettings from 'Hooks/node/useNodeSettings'
import { FC, useState, useEffect, memo, useMemo } from 'react'
import pick from 'lodash/pick'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'

const Information: FC = memo(() => {
  return (
    <Box maxWidth="21.5rem" mt="1rem">
      <chakra.h3 mb="1rem">Settings</chakra.h3>
      <chakra.h5
        mb="2rem"
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
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
      <Flex display="column">
        <Grid
          w="37.25rem"
          templateColumns="repeat(2, 1fr)"
          gridAutoRows={'auto'}
          gap="2rem"
        >
          <Skeleton variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Node name"
              value={nodeSettings?.nodeName}
              InputProps={{
                onChange: e => updateSettingValue('nodeName', e.target.value),
              }}
            />
          </Skeleton>
          <Skeleton variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Block graffiti"
              value={nodeSettings?.blockGraffiti}
              InputProps={{
                onChange: e =>
                  updateSettingValue('blockGraffiti', e.target.value),
              }}
            />
          </Skeleton>
          <Skeleton variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Min Peers"
              value={nodeSettings?.minPeers?.toString()}
              InputProps={{
                type: 'number',
                onChange: e => updateSettingValue('minPeers', e.target.value),
              }}
            />
          </Skeleton>
          <Skeleton variant="ironFish" isLoaded={!!data}>
            <TextField
              label="Max peers"
              value={nodeSettings?.maxPeers?.toString()}
              InputProps={{
                type: 'number',
                onChange: e => updateSettingValue('maxPeers', e.target.value),
              }}
            />
          </Skeleton>
          <Skeleton variant="ironFish" isLoaded={!!data}>
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
          <Skeleton variant="ironFish" isLoaded={!!data}>
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
        </Grid>
        <Button
          mt="2rem"
          variant="primary"
          size="large"
          onClick={handleSaveSettings}
          isDisabled={!loaded || hasNoChanges}
        >
          Save settings
        </Button>
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

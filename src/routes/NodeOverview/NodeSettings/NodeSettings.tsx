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
  FormControl,
  FormLabel,
  Switch,
} from '@ironfish/ui-kit'
import useNodeSettings from 'Hooks/node/useNodeSettings'
import { FC, useState, useEffect, memo, useMemo } from 'react'
import pick from 'lodash/pick'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import NodeWorkersSelect from './NodeWorkersSelect'

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
  'enableTelemetry',
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
            <NodeWorkersSelect
              value={nodeSettings?.nodeWorkers?.toString()}
              onSelectOption={selected =>
                updateSettingValue('nodeWorkers', selected.value)
              }
            />
            {/* <TextField
              label="Node workers"
              value={nodeSettings?.nodeWorkers?.toString()}
              InputProps={{
                type: 'number',
                onChange: e =>
                  updateSettingValue('nodeWorkers', e.target.value),
              }}
            /> */}
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
        <br />
        <Flex gap="2rem">
          <Skeleton w="50%" my="1rem" variant="ironFish" isLoaded={!!data}>
            <FormControl display="flex" alignItems="center">
              <Switch
                size="md"
                id="toggle-telemetry"
                isChecked={nodeSettings?.enableTelemetry}
                onChange={e =>
                  updateSettingValue('enableTelemetry', e.target.checked)
                }
                mr="0.5rem"
              />
              <FormLabel htmlFor="toggle-telemetry" mb="0">
                {nodeSettings?.enableTelemetry
                  ? 'Telemetry enabled'
                  : 'Telemetry disabled'}
              </FormLabel>
            </FormControl>
          </Skeleton>
          <Flex w="50%" />
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

import { useEffect, useState } from 'react'
import {
  chakra,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import useNodeSettings from 'Hooks/node/useNodeSettings'
import ModalWindow from 'Components/ModalWindow'
import SwitchToggle from 'Components/SwitchToggle'

const FirstRunTelemetryModal = () => {
  const [enableTelemetry, setEnableTelemetry] = useState<boolean>(true)
  const {
    data,
    loaded,
    actions: { saveSettings },
  } = useNodeSettings()

  useEffect(() => {
    window.IronfishManager.isFirstRun().then(
      isFirstRun => isFirstRun && onOpen()
    )
  }, [])
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setEnableTelemetry(data?.enableTelemetry)
  }, [loaded])

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose}>
      <chakra.h2 mb="1rem">Telemetry</chakra.h2>
      <chakra.h4 mb="1.5rem">
        We'd like to collect{' '}
        <Button
          variant="link"
          color={NAMED_COLORS.LIGHT_BLUE}
          onClick={() => window.open('https://stats.ironfish.network/?orgId=1')}
        >
          telemetry data
        </Button>{' '}
        in order to continually improve your experience. This data includes node
        performance, block information, and other health metrics. You can enable
        or disable this at any time in the node settings page.
      </chakra.h4>
      <FormControl mb="1.5rem" display="flex" alignItems="center">
        <SwitchToggle
          id="toggle-telemetry"
          isChecked={enableTelemetry}
          onChange={() => setEnableTelemetry(prev => !prev)}
          mr="1rem"
        />
        <FormLabel htmlFor="toggle-telemetry" mb="0">
          {enableTelemetry ? 'Telemetry enabled' : 'Telemetry disabled'}
        </FormLabel>
      </FormControl>
      <Button
        variant="primary"
        size="medium"
        my="1rem"
        onClick={() => {
          if (data?.enableTelemetry !== enableTelemetry) {
            saveSettings({ enableTelemetry })
          }
          onClose()
        }}
      >
        <chakra.h4>Continue</chakra.h4>
      </Button>
    </ModalWindow>
  )
}

export default FirstRunTelemetryModal

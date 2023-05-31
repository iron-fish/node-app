import {
  chakra,
  NAMED_COLORS,
  Button,
  FormControl,
  useDisclosure,
  FormLabel,
  Flex,
  Box,
  Switch,
} from '@ironfish/ui-kit'
import { useEffect, useState } from 'react'
import { ROUTES } from 'Routes/data'
import useNodeSettings from 'Hooks/node/useNodeSettings'
import { Link } from 'react-router-dom'
import Logo from 'Svgx/Logo'

const Telemetry = () => {
  const [enableTelemetry, setEnableTelemetry] = useState<boolean>(true)
  const {
    data,
    loaded,
    actions: { saveSettings },
  } = useNodeSettings()

  const { onOpen, onClose } = useDisclosure()
  useEffect(() => {
    window.IronfishManager.isFirstRun().then(
      isFirstRun => isFirstRun && onOpen()
    )
  }, [])

  useEffect(() => {
    setEnableTelemetry(data?.enableTelemetry)
  }, [loaded, data?.enableTelemetry])

  return (
    <Flex flexDirection="column" p="4rem" pb="0" bg="transparent">
      <Logo mt={{ base: 0, sm: '2rem' }} mb="4rem" color={NAMED_COLORS.BLACK} />
      <chakra.h1 mb="1rem" color={NAMED_COLORS.BLACK}>
        Iron Fish Node App
      </chakra.h1>
      <Box
        p="2rem"
        layerStyle="card"
        w="100%"
        maxWidth="36.75rem"
        mb="2rem"
        bg={`${NAMED_COLORS.WHITE} !important`}
        boxShadow={`0.25rem 0.25rem 0 -0.063rem ${NAMED_COLORS.WHITE}, 0.25rem 0.25rem ${NAMED_COLORS.LIGHT_GREY}, 0 0.25rem 0.6875rem rgba(0, 0, 0, 0.04) !important`}
        borderColor={`${NAMED_COLORS.LIGHT_GREY} !important`}
      >
        <chakra.h2 color={NAMED_COLORS.BLACK} mb="1rem">
          Telemetry
        </chakra.h2>
        <chakra.h4 color={NAMED_COLORS.BLACK} mb="1.5rem">
          We'd like to collect{' '}
          <Button
            variant="link"
            color={NAMED_COLORS.LIGHT_BLUE}
            onClick={() =>
              window.open('https://stats.ironfish.network/?orgId=1')
            }
          >
            anonymous telemetry data
          </Button>{' '}
          in order to continually improve your experience. This data includes
          node performance, block information, and other health metrics. You can
          enable or disable this at any time in the node settings page.
        </chakra.h4>
        <FormControl mb="1.5rem" display="flex" alignItems="center">
          <Switch
            id="toggle-telemetry"
            isChecked={enableTelemetry}
            onChange={() => setEnableTelemetry(prev => !prev)}
            mr="1rem"
          />
          <FormLabel
            color={NAMED_COLORS.BLACK}
            htmlFor="toggle-telemetry"
            mb="0"
          >
            {enableTelemetry ? 'Telemetry enabled' : 'Telemetry disabled'}
          </FormLabel>
        </FormControl>
        <Button
          variant="primary"
          size="medium"
          my="1rem"
          as={Link}
          to={ROUTES.ACCOUNTS}
          onClick={() => {
            if (data?.enableTelemetry !== enableTelemetry) {
              saveSettings({ enableTelemetry })
            }
            onClose()
          }}
        >
          <chakra.h4>Continue</chakra.h4>
        </Button>
      </Box>
    </Flex>
  )
}

export default Telemetry

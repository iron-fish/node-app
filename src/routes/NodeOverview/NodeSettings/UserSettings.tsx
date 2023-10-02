import {
  Flex,
  chakra,
  Button,
  Skeleton,
  Box,
  NAMED_COLORS,
  Grid,
  useColorMode,
  Stat,
  StatLabel,
} from '@ironfish/ui-kit'
import { FC, useState, memo } from 'react'
import DetailsPanel from 'Components/DetailsPanel'
import NodeSettingsImageLight from 'Svgx/NodeSettingsImageLight'
import NodeSettingsImageDark from 'Svgx/NodeSettingsImageDark'
import { useQuery } from 'react-query'

const Information: FC = memo(() => {
  const isLightMode = useColorMode().colorMode === 'light'
  return (
    <Box maxWidth="21.5rem" mt="1rem">
      <chakra.h3 mb="1rem">User Settings</chakra.h3>
      <chakra.h5
        mb="2rem"
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
        Change the Data Directory will change which node your app points to.
        Select the folder where your node's database is stored
      </chakra.h5>
      {isLightMode ? <NodeSettingsImageLight /> : <NodeSettingsImageDark />}
    </Box>
  )
})

const NodeSettings: FC = () => {
  const [inputDataDir, setInputDataDir] = useState<string>()

  const { data, isLoading } = useQuery('user-settings', () =>
    window.IronfishManager.getUserSettings()
  )

  const currentDataDir = data.dataDir

  const handleSaveDataDir = () => {
    window.IronfishManager.saveUserSettings({ dataDir: inputDataDir })
  }

  const handleSelectFolder = async () => {
    const folder = await window.selectFolder()
    if (folder) {
      setInputDataDir(folder)
    }
  }

  return (
    <>
      <Flex>
        <Flex display="column">
          <Grid
            w="37.25rem"
            templateColumns="repeat(2, 1fr)"
            gridAutoRows={'auto'}
            gap="2rem"
          >
            <Stat>
              <StatLabel>
                <chakra.h6 color="#9B7641">Data Directory</chakra.h6>
              </StatLabel>
              <Skeleton
                isLoaded={!isLoading}
                minW="6rem"
                minH="2.4rem"
                startColor="#F3C174"
                endColor="#F1B75E"
              >
                <chakra.h4>{inputDataDir ?? currentDataDir}</chakra.h4>
              </Skeleton>
            </Stat>
          </Grid>
          <br />
          <Flex my="1rem" gap="32px">
            <Button variant="primary" size="large" onClick={handleSelectFolder}>
              Select Data Directory
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={handleSaveDataDir}
              isDisabled={!inputDataDir || inputDataDir === currentDataDir}
            >
              Save & Restart
            </Button>
          </Flex>
          <Flex my="1rem" gap="32px"></Flex>
        </Flex>
        <Box>
          <DetailsPanel>
            <Information />
          </DetailsPanel>
        </Box>
      </Flex>
    </>
  )
}

export default NodeSettings

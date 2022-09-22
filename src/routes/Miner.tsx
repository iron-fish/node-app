import {
  Box,
  Button,
  Flex,
  NAMED_COLORS,
  FONTS,
  SelectField,
  Switch,
  useColorModeValue,
  chakra,
  VStack,
  HStack,
} from '@ironfish/ui-kit'
import { buildChartTheme, Axis, Grid, LineSeries, XYChart } from '@visx/xychart'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState } from 'react'
import MinerInfoImage from 'Svgx/MinerInfoImage'

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Earning $IRON</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Using the miner not only earns you real $IRON but it also helps the
        blockchain as a whole. Use the full power of you machine and all of its
        cores and earn to your fullest potential.
      </chakra.h5>
      <MinerInfoImage />
    </Box>
  )
})

const ACCOUNTS = [
  {
    value: 'PrimaryAccountId',
    label: 'Primary Account',
    helperText: '8,456 $IRON',
  },
  {
    value: 'AccountId',
    label: 'Account',
    helperText: '100 $IRON',
  },
]

const MINDED_OPTIONS = [
  { value: 'allTime', label: 'All Time $IRON Mined' },
  { value: 'lastWeek', label: 'Last Week $IRON Mined' },
  { value: 'lastMonth', label: 'Last Month $IRON Mined' },
]

const HASH_RATE_DATA = [
  { time: new Date(1), value: 150 },
  { time: new Date(2), value: 300 },
  { time: new Date(3), value: 200 },
  { time: new Date(4), value: 350 },
  { time: new Date(5), value: 250 },
]

interface HashRate {
  time: Date
  value: number
}

const HashRateChart = () => {
  const $colors = useColorModeValue(
    {
      chartTheme: buildChartTheme({
        backgroundColor: NAMED_COLORS.WHITE,
        colors: ['#389810'],
        gridColor: NAMED_COLORS.LIGHT_GREY,
        gridColorDark: NAMED_COLORS.LIGHT_GREY,
        tickLength: 0,
        svgLabelSmall: {
          fill: NAMED_COLORS.GREY,
          fontSize: '0.625rem',
          fontFamily: FONTS.FAVORIT,
        },
      }),
    },
    {
      chartTheme: buildChartTheme({
        backgroundColor: NAMED_COLORS.DARKER_GREY,
        colors: ['#389810'],
        gridColor: NAMED_COLORS.DARK_GREY,
        gridColorDark: NAMED_COLORS.DARK_GREY,
        tickLength: 0,
        svgLabelSmall: {
          fill: NAMED_COLORS.PALE_GREY,
          fontSize: '0.625rem',
          fontFamily: FONTS.FAVORIT,
        },
      }),
    }
  )
  const accessors = {
    xAccessor: (d: HashRate) => d.time,
    yAccessor: (d: HashRate) => d.value,
  }

  return (
    <XYChart
      theme={$colors.chartTheme}
      margin={{ top: 10, right: 0, bottom: 0, left: 24 }}
      height={56}
      xScale={{ type: 'utc' }}
      yScale={{ type: 'linear' }}
    >
      <Axis hideZero orientation="left" numTicks={4} />
      <Grid columns={false} numTicks={4} />
      <LineSeries
        dataKey="hash_rate_line"
        data={HASH_RATE_DATA}
        {...accessors}
      />
    </XYChart>
  )
}

const Miner: FC = props => {
  const [account, setAccount] = useState<OptionType>(ACCOUNTS[0])
  const [miningPeriod, setMiningPeriod] = useState<OptionType>(
    MINDED_OPTIONS[0]
  )
  const [isRunning, setIsRunning] = useState(true)
  const checkChanges: () => boolean = () => isRunning !== true

  return (
    <Flex mb="2rem" direction="column">
      <chakra.h2 mb="1.25rem">Miner</chakra.h2>
      <Flex>
        <VStack spacing="2rem" w="37.25rem" align="flex-start">
          <SelectField
            w="100%"
            label="Account"
            value={account}
            onSelectOption={setAccount}
            options={ACCOUNTS}
          />
          <Flex
            layerStyle="card"
            w="100%"
            maxWidth="37rem"
            h="14.375rem"
            p="2rem"
          >
            <VStack w="50%" align="flex-start" spacing="2rem">
              <chakra.h4>$IRON Mined</chakra.h4>
              <chakra.h1>143.453</chakra.h1>
              <chakra.h6>USD $ --</chakra.h6>
            </VStack>
            <SelectField
              w="50%"
              label=""
              value={miningPeriod}
              onSelectOption={setMiningPeriod}
              options={MINDED_OPTIONS}
              size="small"
            />
          </Flex>
          <HStack w="calc(100% - 0.25rem)" spacing="2rem">
            <VStack
              layerStyle="card"
              w="100%"
              maxWidth="36.75rem"
              h="14.375rem"
              p="2rem"
              spacing="2rem"
              ml="0"
            >
              <chakra.h4>Miner Status</chakra.h4>
              <chakra.h1>Running</chakra.h1>
              <Switch
                isChecked={isRunning}
                onChange={e => setIsRunning(e.target.checked)}
                size="lg"
                sx={{
                  '.chakra-switch__track': {
                    bg: NAMED_COLORS.WHITE,
                    border: `0.0625rem solid ${NAMED_COLORS.LIGHT_GREY}`,
                    _checked: {
                      bg: NAMED_COLORS.WHITE,
                    },
                    _focus: {
                      boxShadow: 'none',
                    },
                  },
                  '.chakra-switch__thumb': {
                    _checked: {
                      background: '#389810',
                    },
                    background: NAMED_COLORS.DEEP_BLUE,
                  },
                }}
              />
            </VStack>
            <VStack
              layerStyle="card"
              w="100%"
              maxWidth="36.75rem"
              h="14.375rem"
              px="1rem"
              ml={0}
            >
              <chakra.h4 my="2rem">Hashes Per Second</chakra.h4>
              <chakra.h1>300</chakra.h1>
              <Box w="100%" h="3.625rem">
                <HashRateChart />
              </Box>
            </VStack>
          </HStack>
          <Button
            p="2rem"
            borderRadius="4.5rem"
            variant="primary"
            mr="2rem"
            isDisabled={!checkChanges()}
          >
            Save Changes
          </Button>
        </VStack>
        <Box>
          <DetailsPanel>
            <Information />
          </DetailsPanel>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Miner

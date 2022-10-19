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
  Skeleton,
} from '@ironfish/ui-kit'
import { buildChartTheme, Axis, Grid, LineSeries, XYChart } from '@visx/xychart'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useMemo, useState } from 'react'
import MinerInfoImage from 'Svgx/MinerInfoImage'
import AccountsSelect from 'Components/AccountsSelect'
import { Account } from 'Data/types/Account'
import useMiner from 'Hooks/miner/useMiner'
import useMinerSpeed from 'Hooks/miner/useMinerSpeed'
import useMinedStatistic from 'Hooks/miner/useMinedStatistic'

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

enum Period {
  ALL_TIME,
  THIS_WEEK,
  LAST_WEEK,
  THIS_MONTH,
  LAST_MONTH,
}

const MINDED_OPTIONS = [
  { value: Period.ALL_TIME, label: 'All Time $IRON Mined' },
  { value: Period.THIS_WEEK, label: 'This Week $IRON Mined' },
  { value: Period.LAST_WEEK, label: 'Last Week $IRON Mined' },
  { value: Period.THIS_MONTH, label: 'This Month $IRON Mined' },
  { value: Period.LAST_MONTH, label: 'Last Month $IRON Mined' },
]

const transformToDateRange: (value: Period) => [Date, Date] = value => {
  const from = new Date()
  from.setHours(0)
  from.setMinutes(0)
  from.setSeconds(0)
  from.setMilliseconds(0)
  const to = new Date()
  to.setHours(23)
  to.setMinutes(59)
  to.setSeconds(59)
  to.setMilliseconds(999)
  switch (value) {
    case Period.THIS_WEEK:
      let day = new Date().getDay() || 7
      from.setHours(-24 * (day - 1))
      return [from, null]
    case Period.LAST_WEEK:
      day = new Date().getDay() || 7
      from.setHours(-24 * 7 * (day - 1))
      to.setHours(23 - 24 * (day - 1))
      return [from, to]
    case Period.THIS_MONTH:
      return [new Date(from.getFullYear(), from.getMonth(), 1), null]
    case Period.LAST_MONTH:
      return [
        new Date(from.getFullYear(), from.getMonth() - 1, 1),
        new Date(from.getFullYear(), from.getMonth(), 1),
      ]
    default:
      return [null, null]
  }
}

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

  const result = useMinerSpeed(1000, 16)

  return (
    <>
      <chakra.h1>{result.pop()?.value?.toFixed(0) || '-'}</chakra.h1>
      <Box w="100%" h="3.625rem">
        <XYChart
          theme={$colors.chartTheme}
          margin={{ top: 10, right: 0, bottom: 0, left: 24 }}
          height={56}
          xScale={{ type: 'utc' }}
          yScale={{ type: 'linear' }}
        >
          <Axis hideZero orientation="left" numTicks={4} />
          <Grid columns={false} numTicks={4} />
          <LineSeries dataKey="hash_rate_line" data={result} {...accessors} />
        </XYChart>
      </Box>
    </>
  )
}

const MinedStatistic: FC<{ accountId: string | null }> = ({ accountId }) => {
  const [miningPeriod, setMiningPeriod] = useState<OptionType>(
    MINDED_OPTIONS[0]
  )

  const period = useMemo(
    () => transformToDateRange(miningPeriod.value),
    [miningPeriod]
  )

  const statistic = useMinedStatistic(
    accountId,
    period[0]?.toISOString(),
    period[1]?.toISOString()
  )

  return (
    <Flex layerStyle="card" w="100%" maxWidth="37rem" h="14.375rem" p="2rem">
      <VStack w="50%" align="flex-start" spacing="2rem">
        <chakra.h4>$IRON Mined</chakra.h4>
        <Skeleton isLoaded={statistic.loaded} minWidth="8rem">
          <chakra.h1>{statistic.data?.amount || 0}</chakra.h1>
        </Skeleton>
        <Skeleton isLoaded={statistic.loaded}>
          <chakra.h6>USD $ --</chakra.h6>
        </Skeleton>
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
  )
}

const Miner: FC = () => {
  const [account, setAccount] = useState<Account>(null)
  const [result, startMining, stopMining] = useMiner()

  return (
    <Flex mb="2rem" direction="column">
      <chakra.h2 mb="1.25rem">Miner</chakra.h2>
      <Flex>
        <VStack spacing="2rem" w="37.25rem" align="flex-start">
          <AccountsSelect
            w="100%"
            label="Account"
            accountId={account?.identity}
            onSelectOption={setAccount}
          />
          <MinedStatistic accountId={account?.identity} />
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
              <chakra.h1>
                {result.data === 'active' ? 'Running' : 'Off'}
              </chakra.h1>
              <Switch
                isDisabled={!account}
                isChecked={result.data === 'active'}
                onChange={e =>
                  result.data === 'active'
                    ? stopMining()
                    : startMining(account.identity)
                }
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
              {result.data === 'active' ? (
                <HashRateChart />
              ) : (
                <chakra.h1>-</chakra.h1>
              )}
            </VStack>
          </HStack>
          <Button
            p="2rem"
            borderRadius="4.5rem"
            variant="primary"
            mr="2rem"
            isDisabled={true}
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

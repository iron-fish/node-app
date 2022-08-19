import {
  Box,
  Button,
  chakra,
  CommonTable,
  Flex,
  Icon,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { FC } from 'react'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import AccountKeysImage from 'Svgx/AccountBalance'
import { truncateHash } from 'Utils/hash'
import SearchSortField from 'Components/Search&Sort'

interface AccountOverviewProps {
  id: string
}

const DEMO_DATA = [
  {
    action: 'Sent',
    amount: '21',
    to: '4321abc23fdabc43ws',
    date: '2021-05-13 14:04:45',
    memo: 'Here’s the payment',
  },
  {
    action: 'Received',
    amount: '4',
    to: null,
    date: '2021-05-13 14:04:45',
    memo: 'ty',
  },
  {
    action: 'Sent',
    amount: '104',
    to: 'Curtis',
    date: '2021-05-13 14:04:45',
    memo: 'Let me know if you get this',
  },
  {
    action: 'Sent',
    amount: '21',
    to: '4321abc23fdabc43ws',
    date: '2021-05-13 14:04:45',
    memo: 'Here’s the payment',
  },
  {
    action: 'Received',
    amount: '4',
    to: null,
    date: '2021-05-13 14:04:45',
    memo: 'ty',
  },
  {
    action: 'Sent',
    amount: '104',
    to: 'Curtis',
    date: '2021-05-13 14:04:45',
    memo: 'Let me know if you get this',
  },
  {
    action: 'Sent',
    amount: '21',
    to: '4321abc23fdabc43ws',
    date: '2021-05-13 14:04:45',
    memo: 'Here’s the payment',
  },
  {
    action: 'Received',
    amount: '4',
    to: null,
    date: '2021-05-13 14:04:45',
    memo: 'ty',
  },
  {
    action: 'Sent',
    amount: '104',
    to: 'Curtis',
    date: '2021-05-13 14:04:45',
    memo: 'Let me know if you get this',
  },
  {
    action: 'Sent',
    amount: '21',
    to: '4321abc23fdabc43ws',
    date: '2021-05-13 14:04:45',
    memo: 'Here’s the payment',
  },
  {
    action: 'Received',
    amount: '4',
    to: null,
    date: '2021-05-13 14:04:45',
    memo: 'ty',
  },
  {
    action: 'Sent',
    amount: '104',
    to: 'Curtis',
    date: '2021-05-13 14:04:45',
    memo: 'Let me know if you get this',
  },
]

const AccountOverview: FC<AccountOverviewProps> = props => {
  const $colors = useColorModeValue(
    {
      borderColor: NAMED_COLORS.DEEP_BLUE,
      boxShadow: `0.25rem 0.25rem 0 -0.063rem ${NAMED_COLORS.WHITE}, 0.25rem 0.25rem ${NAMED_COLORS.DEEP_BLUE}`,
    },
    {
      borderColor: `${NAMED_COLORS.WHITE}!important`,
      boxShadow: `0.25rem 0.25rem 0 -0.063rem ${NAMED_COLORS.DARKER_GREY}, 0.25rem 0.25rem ${NAMED_COLORS.WHITE} !important`,
    }
  )
  return (
    <>
      <Flex w="100%" pb="2rem">
        <Box
          layerStyle="card"
          // p="2rem"
          bg="linear-gradient(92.65deg, #85ADFE 0.41%, #4D88FF 100.03%) !important"
          borderRadius="0.25rem"
          w="100%"
          minWidth="18rem"
          mr="1rem"
          borderColor={$colors.borderColor}
          boxShadow={$colors.boxShadow}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box m="2rem">
              <Box>
                <chakra.h4 color={NAMED_COLORS.DEEP_BLUE}>$IRON</chakra.h4>
              </Box>
              <Box mb="0.5rem">
                <chakra.h2 color={NAMED_COLORS.DEEP_BLUE}>
                  8,456,435.4563
                </chakra.h2>
              </Box>
              <Box>
                <Button
                  variant="primary"
                  borderRadius="4rem"
                  mr="1rem"
                  borderColor="transparent"
                  leftIcon={
                    <Icon height={8}>
                      <Send fill="currentColor" />
                    </Icon>
                  }
                >
                  <h5>Send</h5>
                </Button>
                <Button
                  variant="primary"
                  borderRadius="4rem"
                  borderColor="transparent"
                  mr="1rem"
                  leftIcon={
                    <Icon height={8}>
                      <Receive fill="currentColor" />
                    </Icon>
                  }
                >
                  <h5>Receive</h5>
                </Button>
              </Box>
            </Box>
            <Box display={{ base: 'none', md: 'inline-block' }} m="1rem">
              <AccountKeysImage />
            </Box>
          </Flex>
        </Box>
        <Box
          layerStyle="card"
          p="2rem"
          borderRadius="0.25rem"
          minWidth="17.5rem"
        >
          <Box>
            <chakra.h4>Pending $IRON</chakra.h4>
          </Box>
          <Box mb="0.5rem">
            <chakra.h2>143.456</chakra.h2>
          </Box>
        </Box>
      </Flex>
      <chakra.h3 pb="1rem">Transactions</chakra.h3>
      <SearchSortField />
      <CommonTable
        textTransform="capitalize"
        data={DEMO_DATA}
        columns={[
          {
            key: 'transaction-action-column',
            label: <chakra.h6>Action</chakra.h6>,
            render: data => <chakra.h5>{data.action}</chakra.h5>,
          },
          {
            key: 'transaction-amount-column',
            label: <chakra.h6>$IRON</chakra.h6>,
            render: data => <chakra.h5>{data.amount}</chakra.h5>,
          },
          {
            key: 'transaction-to-column',
            label: <chakra.h6>To</chakra.h6>,
            render: data =>
              data.to ? (
                <chakra.h5>{truncateHash(data.to, 3)}</chakra.h5>
              ) : (
                <chakra.h5 color={NAMED_COLORS.GREY}>n/a</chakra.h5>
              ),
          },
          {
            key: 'transaction-date-column',
            label: <chakra.h6>Date</chakra.h6>,
            render: data => <chakra.h5>{data.date}</chakra.h5>,
          },
          {
            key: 'transaction-memo-column',
            label: <chakra.h6>Memo</chakra.h6>,
            render: data => <chakra.h5>"{data.memo}"</chakra.h5>,
          },
          {
            key: 'transaction-details-column',
            label: '',
            ItemProps: {
              height: '100%',
              justifyContent: 'flex-end',
            },
            render: data => (
              <Button
                variant="link"
                color={NAMED_COLORS.LIGHT_BLUE}
                rightIcon={<ChevronRightIcon />}
              >
                <chakra.h5>View Details</chakra.h5>
              </Button>
            ),
          },
        ]}
      />
    </>
  )
}

export default AccountOverview

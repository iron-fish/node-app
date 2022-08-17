import {
  Flex,
  chakra,
  Box,
  CommonTable,
  NAMED_COLORS,
  Icon,
  Link,
} from '@ironfish/ui-kit'
import Caret from 'Svgx/caret-icon'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import SearchSortField from 'Components/Search&Sort'

const DEMO_DATA = [
  {
    action: 'Send',
    iron: 21,
    to: 'Frankie Boy',
    date: new Date().toISOString(),
    memo: "Here's the payment",
  },
  {
    action: 'Receive',
    iron: 21,
    to: 'Frankie Boy',
    date: new Date().toISOString(),
    memo: "Here's the payment",
  },
]

const AddressTransactions = () => {
  return (
    <Flex direction="column" mt="1rem">
      <chakra.h3 mb="1rem">Transactions</chakra.h3>
      <SearchSortField />
      <Flex direction="column" width="100%">
        <CommonTable
          data={DEMO_DATA}
          columns={[
            {
              key: 'action',
              label: 'Action',
              render: address => (
                <Flex align="center" gap="12px">
                  <Flex
                    w="26px"
                    h="26px"
                    borderRadius="50%"
                    align="center"
                    justify="center"
                    background={NAMED_COLORS.LIGHT_GREY}
                  >
                    <Icon h={8}>
                      {address.action === 'Send' ? <Send /> : <Receive />}
                    </Icon>
                  </Flex>
                  {address.action}
                </Flex>
              ),
            },
            {
              key: 'iron',
              label: '$IRON',
              render: address => <Box>{address.iron}</Box>,
            },
            {
              key: 'to',
              label: 'To',
              render: address => <Flex>{address.to}</Flex>,
            },
            {
              key: 'date',
              label: 'Date',
              render: address => <Flex>{address.date}</Flex>,
            },
            {
              key: 'memo',
              label: 'Memo',
              render: address => <Flex>{address.memo}</Flex>,
            },
            {
              key: 'actions',
              label: <>&nbsp;</>,
              render: () => (
                <Link
                  display="flex"
                  sx={{
                    color: NAMED_COLORS.LIGHT_BLUE,
                    _hover: {
                      color: NAMED_COLORS.LIGHT_BLUE,
                    },
                  }}
                >
                  <chakra.h5 mr="0.3125rem">View Details</chakra.h5>
                  <Caret />
                </Link>
              ),
            },
          ]}
        />
      </Flex>
    </Flex>
  )
}

export default AddressTransactions

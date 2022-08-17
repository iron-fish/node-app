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
                <Flex align="center" position="relative">
                  <Flex
                    w="1.625rem"
                    h="1.625rem"
                    position="absolute"
                    borderRadius="50%"
                    align="center"
                    justify="center"
                    background={NAMED_COLORS.LIGHT_GREY}
                  >
                    <Icon h={8}>
                      {address.action === 'Send' ? <Send /> : <Receive />}
                    </Icon>
                  </Flex>
                  <chakra.h5 ml="2.375rem">{address.action}</chakra.h5>
                </Flex>
              ),
            },
            {
              key: 'iron',
              label: '$IRON',
              render: address => <h5>{address.iron}</h5>,
            },
            {
              key: 'to',
              label: 'To',
              render: address => <h5>{address.to}</h5>,
            },
            {
              key: 'date',
              label: 'Date',
              render: address => <h5>{address.date}</h5>,
            },
            {
              key: 'memo',
              label: 'Memo',
              render: address => <h5>{address.memo}</h5>,
            },
            {
              key: 'actions',
              label: '',
              WrapperProps: {
                display: 'flex',
              },
              ItemProps: {
                justifyContent: 'flex-end',
              },
              render: () => (
                <Link
                  sx={{
                    color: NAMED_COLORS.LIGHT_BLUE,
                    _hover: {
                      color: NAMED_COLORS.LIGHT_BLUE,
                    },
                  }}
                >
                  <Flex>
                    <chakra.h5 mr="0.3125rem">View Details</chakra.h5>
                    <Caret />
                  </Flex>
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

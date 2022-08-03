import {
  Flex,
  chakra,
  InputGroup,
  InputLeftElement,
  SelectField,
  Box,
  CommonTable,
  Input,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import IconSearch from '@ironfish/ui-kit/dist/svgx/icon-search'
import Caret from 'Svgx/caret-icon'

const DEMO_DATA = [
  {
    action: 'Sent',
    iron: 21,
    to: 'Frankie Boy',
    date: new Date().toISOString(),
    memo: "Here's the payment",
  },
  {
    action: 'Sent',
    iron: 21,
    to: 'Frankie Boy',
    date: new Date().toISOString(),
    memo: "Here's the payment",
  },
]

const AddressBookTransactions = () => {
  return (
    <Flex direction="column" mt="2rem">
      <chakra.h3 mb="1rem">Transactions</chakra.h3>
      <Flex>
        <InputGroup variant="search" mr="1rem" mb="1rem">
          <InputLeftElement pointerEvents="none">
            <IconSearch />
          </InputLeftElement>
          <Input placeholder="Search" />
        </InputGroup>
        <SelectField
          label="Sort by"
          minWidth="15rem"
          size="small"
          options={[
            {
              label: 'Newest to oldest',
              value: 'desc',
            },
            {
              label: 'Oldest to newest',
              value: 'asc',
            },
          ]}
          whiteSpace="nowrap"
        />
      </Flex>
      <Flex direction="column" width="100%">
        <CommonTable
          data={DEMO_DATA}
          columns={[
            {
              key: 'action',
              label: 'Action',
              render: address => (
                <Flex w="1.625rem" h="1.625rem" alignItems="center">
                  <Box>{address.action}</Box>
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
              label: '',

              render: () => (
                <Flex>
                  <chakra.h5 mr="0.625rem" color={NAMED_COLORS.LIGHT_BLUE}>
                    View Details
                  </chakra.h5>
                  <Caret fill={NAMED_COLORS.LIGHT_BLUE} />
                </Flex>
              ),
            },
          ]}
        />
      </Flex>
    </Flex>
  )
}

export default AddressBookTransactions

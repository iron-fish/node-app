import { FC, useState } from 'react'
import {
  Flex,
  chakra,
  CommonTable,
  NAMED_COLORS,
  Icon,
  Link,
} from '@ironfish/ui-kit'
import Caret from 'Svgx/caret-icon'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useTransactions'
import SortType from 'Types/SortType'

interface AddressTransactionsProps {
  address: string
}

const AddressTransactions: FC<AddressTransactionsProps> = ({ address }) => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)
  const [{ data: transactions, loaded }] = useTransactions(
    address,
    $searchTerm,
    $sortOrder
  )

  return (
    <Flex direction="column" mt="1rem">
      <chakra.h3 mb="1rem">Transactions</chakra.h3>
      <SearchSortField
        SearchProps={{
          onChange: e => $setSearchTerm(e.target.value),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
      />
      <Flex direction="column" width="100%">
        <CommonTable
          data={loaded ? transactions : new Array(10).fill(null)}
          columns={[
            {
              key: 'action',
              label: 'Action',
              render: transaction => (
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
                      {transaction.action === 'Send' ? <Send /> : <Receive />}
                    </Icon>
                  </Flex>
                  <chakra.h5 ml="2.375rem">{transaction.action}</chakra.h5>
                </Flex>
              ),
            },
            {
              key: 'iron',
              label: '$IRON',
              render: transaction => <h5>{transaction.iron}</h5>,
            },
            {
              key: 'to',
              label: 'To',
              render: transaction => <h5>{transaction.to}</h5>,
            },
            {
              key: 'date',
              label: 'Date',
              render: transaction => <h5>{transaction.date}</h5>,
            },
            {
              key: 'memo',
              label: 'Memo',
              render: transaction => <h5>{transaction.memo}</h5>,
            },
            {
              key: 'actions',
              label: '',
              WrapperProps: {
                display: 'flex',
                textAlign: 'right',
                justifyContent: 'flex-end',
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

import { FC, useState } from 'react'
import {
  Flex,
  chakra,
  CommonTable,
  NAMED_COLORS,
  Icon,
  Link,
} from '@ironfish/ui-kit'
import { Link as RouterLink } from 'react-router-dom'
import Caret from 'Svgx/caret-icon'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useAddressTransactions'
import SortType from 'Types/SortType'
import Transaction from 'Types/Transaction'
import ROUTES from 'Routes/data'

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
              render: (transaction: Transaction) => (
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
                      {transaction.creator ? <Send /> : <Receive />}
                    </Icon>
                  </Flex>
                  <chakra.h5 ml="2.375rem">{transaction.status}</chakra.h5>
                </Flex>
              ),
            },
            {
              key: 'iron',
              label: '$IRON',
              render: (transaction: Transaction) => (
                <h5>{transaction.amount}</h5>
              ),
            },
            {
              key: 'to',
              label: 'To',
              render: (transaction: Transaction) => <h5>{transaction.to}</h5>,
            },
            {
              key: 'date',
              label: 'Date',
              render: (transaction: Transaction) => (
                <h5>{transaction.created.toISOString()}</h5>
              ),
            },
            {
              key: 'memo',
              label: 'Memo',
              render: (transaction: Transaction) => (
                <h5>{transaction.notes?.at(0)?.memo}</h5>
              ),
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
              render: (transaction: Transaction) => (
                <Link
                  sx={{
                    color: NAMED_COLORS.LIGHT_BLUE,
                    _hover: {
                      color: NAMED_COLORS.LIGHT_BLUE,
                    },
                  }}
                  as={RouterLink}
                  to={ROUTES.TRANSACTION}
                  state={{
                    accountId: transaction.accountId,
                    hash: transaction.hash,
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

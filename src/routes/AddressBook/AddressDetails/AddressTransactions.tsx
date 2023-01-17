import { FC, useState } from 'react'
import {
  Flex,
  chakra,
  CommonTable,
  NAMED_COLORS,
  Icon,
  Button,
  Box,
} from '@ironfish/ui-kit'
import { ChevronRightIcon } from '@chakra-ui/icons'
import SendIcon from 'Svgx/send'
import Receive from 'Svgx/receive'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useAddressTransactions'
import SortType from 'Types/SortType'
import Transaction from 'Types/Transaction'
import EmptyOverview from 'Components/EmptyOverview'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'

interface AddressTransactionsProps {
  address: string
}

const SearchAddressTransactions: FC<AddressTransactionsProps> = ({
  address,
}) => {
  const navigate = useNavigate()
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
          value: $searchTerm,
          onChange: e => $setSearchTerm(e.target.value.trimStart()),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
        options={[
          {
            label: 'Newest to oldest',
            value: SortType.DESC,
          },
          {
            label: 'Oldest to oldest',
            value: SortType.ASC,
          },
        ]}
      />

      {transactions?.length === 0 ? (
        <EmptyOverview
          header="0 Results"
          description="There aren’t any transactions with details that match your search input."
        />
      ) : (
        <CommonTable
          data={loaded ? transactions : new Array(10).fill(null)}
          onRowClick={(txn: Transaction) => {
            navigate(ROUTES.TRANSACTION, {
              state: { accountId: txn.accountId, hash: txn.hash },
            })
          }}
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
                      {transaction.creator ? <SendIcon /> : <Receive />}
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
              ItemProps: {
                marginLeft: 'auto',
                width: 'min-content',
              },
              render: () => (
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
      )}
    </Flex>
  )
}

const AddressTransactions: FC<AddressTransactionsProps> = ({ address }) => {
  const [{ data: transactions = undefined, loaded }] = useTransactions(address)

  return (
    <Box display={address && loaded ? 'block' : 'none'}>
      {transactions?.length === 0 ? (
        <EmptyOverview
          header="You don’t have any transactions"
          description="You don’t have any transaction with this contact yet. To produce a transactions, either send or receive $IRON. "
        />
      ) : (
        <SearchAddressTransactions address={address} />
      )}
    </Box>
  )
}

export default AddressTransactions

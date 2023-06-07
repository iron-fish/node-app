import { FC, useEffect, useState, useDeferredValue } from 'react'
import { Flex, chakra, Box, useBreakpointValue } from '@ironfish/ui-kit'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useAddressTransactions'
import SortType from 'Types/SortType'
import Transaction from 'Types/Transaction'
import EmptyOverview from 'Components/EmptyOverview'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import ContactsPreview from 'Components/ContactsPreview'
import Contact from 'Types/Contact'
import TransactionStatusView from 'Components/TransactionStatusView'
import WalletCommonTable, { ACTIONS_COLUMN } from 'Components/WalletCommonTable'
import AssetsAmountPreview from 'Components/AssetsAmountPreview'
import { formatDate } from 'Utils/formatDate'

interface AddressTransactionsProps {
  address: string
  contact: Contact
}

const SearchAddressTransactions: FC<AddressTransactionsProps> = ({
  address,
  contact,
}) => {
  const navigate = useNavigate()
  const [$searchTerm, $setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue($searchTerm)
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.DESC)
  const {
    data: transactions,
    loaded,
    actions: { reload },
  } = useTransactions(address, deferredSearchTerm, $sortOrder)
  const isCompactView = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    let interval: NodeJS.Timer
    if (loaded) {
      interval = setInterval(reload, 5000)
    }

    return () => interval && clearInterval(interval)
  }, [loaded])

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
        sortValue={$sortOrder}
        options={[
          {
            label: 'Newest to oldest',
            value: SortType.DESC,
          },
          {
            label: 'Oldest to newest',
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
        <WalletCommonTable
          data={!!transactions ? transactions : new Array(10).fill(null)}
          onRowClick={(txn: Transaction) => {
            navigate(ROUTES.TRANSACTION, {
              state: {
                accountId: txn.accountId,
                hash: txn.hash,
                contactId: contact._id,
              },
            })
          }}
          columns={[
            {
              key: 'action',
              label: 'Action',
              render: (transaction: Transaction) => (
                <TransactionStatusView transaction={transaction} />
              ),
            },
            {
              key: 'iron',
              label: 'Asset',
              render: (transaction: Transaction) => (
                <AssetsAmountPreview
                  assetAmounts={
                    transaction?.assetAmounts.length
                      ? transaction?.assetAmounts
                      : transaction?.amount
                      ? [transaction?.amount]
                      : []
                  }
                />
              ),
            },
            {
              key: 'to',
              label: 'To',
              render: (transaction: Transaction) => (
                <ContactsPreview
                  addresses={transaction.to}
                  notes={transaction.outputs}
                />
              ),
            },
            {
              key: 'date',
              label: 'Date',
              render: (transaction: Transaction) => (
                <h5>{formatDate(transaction.created)}</h5>
              ),
            },
            {
              key: 'memo',
              label: 'Memo',
              render: (transaction: Transaction) => (
                <h5>{transaction.outputs?.at(0)?.memo}</h5>
              ),
            },
            ...(isCompactView ? [] : [ACTIONS_COLUMN]),
          ]}
        />
      )}
    </Flex>
  )
}

const AddressTransactions: FC<AddressTransactionsProps> = ({
  address,
  contact,
}) => {
  const { data: transactions = undefined, loaded } = useTransactions(address)

  return (
    <Box display={address && loaded ? 'block' : 'none'}>
      {transactions?.length === 0 ? (
        <EmptyOverview
          header="You don’t have any transactions"
          description="You don’t have any transaction with this contact yet. To produce a transactions, either send or receive $IRON. "
        />
      ) : (
        <SearchAddressTransactions address={address} contact={contact} />
      )}
    </Box>
  )
}

export default AddressTransactions

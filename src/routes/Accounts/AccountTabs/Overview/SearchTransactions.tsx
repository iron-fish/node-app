import { FC, useEffect, useState, useDeferredValue } from 'react'
import { Box, chakra, useIronToast } from '@ironfish/ui-kit'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useAccountTransactions'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import SortType from 'Types/SortType'
import Transaction, { TransactionStatus } from 'Types/Transaction'
import TransactionStatusView from 'Components/TransactionStatusView'
import EmptyOverview from 'Components/EmptyOverview'
import ContactsPreview from 'Components/ContactsPreview'
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import WalletCommonTable, { ACTIONS_COLUMN } from 'Components/WalletCommonTable'
import AssetsAmountPreview from 'Components/AssetsAmountPreview'
import { formatDate } from 'Utils/formatDate'

interface SearchTransactionsProps {
  address: string
}

const SearchTransactions: FC<SearchTransactionsProps> = ({ address }) => {
  const navigate = useNavigate()
  const [$searchTerm, $setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue($searchTerm)
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.DESC)
  const {
    data: transactions = undefined,
    loaded,
    actions: { reload },
  } = useTransactions(address, deferredSearchTerm, $sortOrder)
  const trxLoaded = useDeferredValue(loaded)
  const [, setTransactionsState] = useState([])
  const toast = useIronToast({
    containerStyle: {
      mb: '1rem',
    },
  })

  useEffect(() => {
    let interval: NodeJS.Timer
    if (trxLoaded) {
      interval = setInterval(reload, 5000)
    }

    return () => interval && clearInterval(interval)
  }, [trxLoaded])

  useEffect(() => {
    setTransactionsState(prevTransactions => {
      if (!transactions) {
        return []
      }

      const formattedTransactions = transactions.map(({ hash, status }) => ({
        hash,
        status,
      }))

      // check only fetched transactions
      let nextTransactions = intersectionBy(
        prevTransactions,
        formattedTransactions,
        'hash'
      )

      // if fetched more then was add missing
      if (transactions.length > prevTransactions.length) {
        nextTransactions = nextTransactions.concat(
          differenceBy(formattedTransactions, prevTransactions, 'hash')
        )
      }

      const pendingTransactions = formattedTransactions.filter(
        t =>
          t.status === TransactionStatus.PENDING ||
          t.status === TransactionStatus.UNCONFIRMED ||
          t.status === TransactionStatus.UNKNOWN
      )

      const prevPendingTransactions = nextTransactions.filter(
        t =>
          t.status === TransactionStatus.PENDING ||
          t.status === TransactionStatus.UNCONFIRMED ||
          t.status === TransactionStatus.UNKNOWN
      )

      const txnCount =
        transactions.length > prevTransactions.length
          ? differenceBy(pendingTransactions, prevPendingTransactions, 'hash')
          : differenceBy(prevPendingTransactions, pendingTransactions, 'hash')

      if (txnCount.length) {
        toast({ title: 'Transaction Sent' })
      }
      return transactions.map(({ hash, status }) => ({ hash, status }))
    })
  }, [trxLoaded])

  return trxLoaded &&
    transactions?.length === 0 &&
    !deferredSearchTerm ? null : (
    <>
      <Box>
        <chakra.h3 pb="1rem">Transactions</chakra.h3>
        <SearchSortField
          SearchProps={{
            value: $searchTerm,
            onChange: e => $setSearchTerm(e.target.value),
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
      </Box>
      {transactions?.length === 0 ? (
        <EmptyOverview
          header="0 Results"
          description="There aren’t any transactions with details that match your search input. "
        />
      ) : (
        <WalletCommonTable
          data={!!transactions ? transactions : new Array(10).fill(null)}
          onRowClick={(data: Transaction) =>
            navigate(ROUTES.TRANSACTION, {
              state: { accountId: data.accountId, hash: data.hash },
            })
          }
          columns={[
            {
              key: 'transaction-action-column',
              label: <chakra.h6>Action</chakra.h6>,
              render: transaction => (
                <TransactionStatusView
                  status={transaction.status}
                  isSent={transaction.creator}
                />
              ),
            },
            {
              key: 'transaction-amount-column',
              label: <chakra.h6>Amount</chakra.h6>,
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
              key: 'transaction-to-column',
              label: <chakra.h6>From/To</chakra.h6>,
              render: (transaction: Transaction) => (
                <ContactsPreview
                  addresses={
                    transaction.creator
                      ? transaction.to
                      : transaction.from
                      ? [transaction.from]
                      : []
                  }
                  notes={transaction.outputs}
                />
              ),
            },
            {
              key: 'transaction-date-column',
              label: <chakra.h6>Date</chakra.h6>,
              render: (transaction: Transaction) => (
                <chakra.h5>{formatDate(transaction.created)}</chakra.h5>
              ),
            },
            {
              key: 'transaction-memo-column',
              label: <chakra.h6>Memo</chakra.h6>,
              render: (transaction: Transaction) => (
                <chakra.h5>
                  "
                  {transaction.outputs?.at(0)?.memo ||
                    transaction.inputs?.at(0)?.memo}
                  "
                </chakra.h5>
              ),
            },
            ACTIONS_COLUMN,
          ]}
        />
      )}
    </>
  )
}

export default SearchTransactions

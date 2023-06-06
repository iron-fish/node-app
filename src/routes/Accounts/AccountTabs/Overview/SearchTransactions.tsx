import { FC, useEffect, useRef } from 'react'
import {
  Box,
  chakra,
  HStack,
  Spinner,
  useBreakpointValue,
} from '@ironfish/ui-kit'
import { usePaginatedAccountTransactions } from 'Hooks/transactions/useAccountTransactions'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import Transaction from 'Types/Transaction'
import TransactionStatusView from 'Components/TransactionStatusView'
import EmptyOverview from 'Components/EmptyOverview'
import ContactsPreview from 'Components/ContactsPreview'
import WalletCommonTable, { ACTIONS_COLUMN } from 'Components/WalletCommonTable'
import AssetsAmountPreview from 'Components/AssetsAmountPreview'
import { formatDate } from 'Utils/formatDate'

interface SearchTransactionsProps {
  address: string
}

const SearchTransactions: FC<SearchTransactionsProps> = ({ address }) => {
  const navigate = useNavigate()
  const isCompactView = useBreakpointValue({ base: true, md: false })

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePaginatedAccountTransactions(address)

  const transactions = data?.pages.flatMap(item => item.transactions) ?? []

  if (isLoading)
    return (
      <HStack justifyContent="center">
        <Spinner />
      </HStack>
    )

  if (transactions.length === 0) {
    return (
      <EmptyOverview
        header="You don't have any transactions"
        description="When your account compiles transactions they will be listed here. To produce a transactions, eitherF send or receive $IRON."
      />
    )
  }

  transactions[0].hash

  return (
    <>
      <Box>
        <chakra.h3 pb="1rem">Transactions</chakra.h3>
      </Box>
      {transactions?.length === 0 ? (
        <EmptyOverview
          header="0 Results"
          description="There aren't any transactions with details that match your search input. "
        />
      ) : (
        <WalletCommonTable
          data={!!transactions ? transactions : new Array(10).fill(null)}
          onRowClick={(transaction: Transaction) =>
            navigate(ROUTES.TRANSACTION, {
              state: {
                accountId: transaction.accountId,
                hash: transaction.hash,
              },
            })
          }
          columns={[
            {
              key: 'transaction-action-column',
              label: <chakra.h6>Action</chakra.h6>,
              render: transaction => (
                <TransactionStatusView transaction={transaction} />
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
            ...(isCompactView ? [] : [ACTIONS_COLUMN]),
            ,
          ]}
        />
      )}
      <OnScrollIntoView
        handler={() => {
          console.log('VISIBLE')
          if (hasNextPage) {
            console.log('FETCHING')
            fetchNextPage()
          }
        }}
        loading={isFetchingNextPage}
      />
    </>
  )
}

function OnScrollIntoView({
  handler,
  loading,
}: {
  handler: () => void
  loading: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        handler()
      }
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return (
    <Box ref={ref}>
      {loading && (
        <HStack justifyContent="center">
          <Spinner />
        </HStack>
      )}
    </Box>
  )
}

export default SearchTransactions

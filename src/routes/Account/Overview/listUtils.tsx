import { useCallback, useMemo, useRef } from 'react'
import Account from 'Types/Account'
import { OverviewStats } from './OverviewStats/OverviewStats'
import {
  EmptyState,
  Loader,
  ROW_SIZE,
  TransactionRow,
  TransactionsHeadings,
  TRANSACTIONS_HEADINGS_HEIGHT,
  TransactionTitle,
  TRANSACTION_TITLE_HEIGHT,
} from './Transactions/Transactions'
import { Container } from '../Shared/Container'
import Transaction from 'Types/Transaction'

type BaseRowRendererArgs = {
  index: number
  style: React.CSSProperties
}

type AdditionalRowRendererArgs = {
  account: Account
  hasTransactions: boolean
  isLoading: boolean
  transactions: Transaction[]
  handleOverviewResize: (size: number) => void
}

function fullRowRenderer({
  index,
  style,
  account,
  hasTransactions,
  isLoading,
  transactions,
  handleOverviewResize,
}: BaseRowRendererArgs & AdditionalRowRendererArgs) {
  /**
   * @todo: These magic indexes are pretty hacky. Update this so that
   * the elements and their sizes can be calculated dynamically.
   */
  if (index === 0) {
    return (
      <Container>
        <OverviewStats account={account} setSize={handleOverviewResize} />
      </Container>
    )
  }

  if (index === 1) {
    return hasTransactions ? <TransactionTitle style={style} /> : null
  }

  if (index === 2) {
    return hasTransactions ? <TransactionsHeadings style={style} /> : null
  }

  if (isLoading) {
    return <Loader style={style} />
  }

  if (!hasTransactions) {
    return <EmptyState style={style} />
  }

  const transaction = transactions[index - 3]

  if (!transaction) {
    return <Loader style={style} />
  }

  return <TransactionRow style={style} transaction={transaction} />
}

export function useRowRenderer({
  account,
  hasTransactions,
  isLoading,
  transactions,
  handleOverviewResize,
}: AdditionalRowRendererArgs) {
  return useCallback(
    ({ index, style }: BaseRowRendererArgs) => {
      return fullRowRenderer({
        index,
        style,
        account,
        hasTransactions,
        isLoading,
        transactions,
        handleOverviewResize,
      })
    },
    [account, handleOverviewResize, hasTransactions, isLoading, transactions]
  )
}

export function useItemSize(isEmptyState: boolean) {
  const overviewHeightRef = useRef(0)

  const getItemSize = useCallback(
    (index: number) => {
      /**
       * @todo: Clean up magic indices.
       */
      if (index === 0) {
        return overviewHeightRef.current
      }
      if (index === 1) {
        return isEmptyState ? 0 : TRANSACTION_TITLE_HEIGHT
      }
      if (index === 2) {
        return isEmptyState ? 0 : TRANSACTIONS_HEADINGS_HEIGHT
      }
      return ROW_SIZE
    },
    [isEmptyState]
  )

  return { getItemSize, overviewHeightRef }
}

export function useItemCount({
  isLoading,
  hasTransactions,
  hasNextPage,
  transactions,
}: {
  isLoading: boolean
  hasTransactions: boolean
  hasNextPage: boolean
  transactions: Transaction[]
}) {
  return useMemo(() => {
    /**
     * @todo: Clean up magic number.
     */
    const nonTransactionRows = 3

    if (isLoading || !hasTransactions) return nonTransactionRows + 1

    if (hasNextPage) return transactions.length + nonTransactionRows + 1

    return transactions.length + nonTransactionRows
  }, [hasNextPage, isLoading, transactions.length, hasTransactions])
}

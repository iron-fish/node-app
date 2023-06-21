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
  TransactionsTitle,
  TRANSACTIONS_TITLE_HEIGHT,
} from './Transactions/Transactions'
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
  isReverseSort: boolean
  setIsReverseSort: (isReverseSort: boolean) => void
}

type CombinedRowRendererArgs = BaseRowRendererArgs & AdditionalRowRendererArgs

const FIXED_ROWS: Array<{
  render: (args: CombinedRowRendererArgs) => null | JSX.Element
  getSize: (args: {
    overviewHeightRef: React.MutableRefObject<number>
    isEmptyState: boolean
  }) => number
}> = [
  {
    render({ account, handleOverviewResize }) {
      return <OverviewStats account={account} setSize={handleOverviewResize} />
    },
    getSize({ overviewHeightRef }) {
      return overviewHeightRef.current
    },
  },
  {
    render({ hasTransactions, style, isReverseSort, setIsReverseSort }) {
      return hasTransactions ? (
        <TransactionsTitle
          style={style}
          isReverseSort={isReverseSort}
          setIsReverseSort={setIsReverseSort}
        />
      ) : null
    },
    getSize({ isEmptyState }) {
      return isEmptyState ? 0 : TRANSACTIONS_TITLE_HEIGHT
    },
  },
  {
    render({ hasTransactions, style }) {
      return hasTransactions ? <TransactionsHeadings style={style} /> : null
    },
    getSize({ isEmptyState }) {
      return isEmptyState ? 0 : TRANSACTIONS_HEADINGS_HEIGHT
    },
  },
]

export const FIXED_ROW_COUNT = FIXED_ROWS.length

function fullRowRenderer(args: CombinedRowRendererArgs) {
  const { index, style, hasTransactions, isLoading, transactions } = args

  if (index < FIXED_ROWS.length) {
    return FIXED_ROWS[index].render(args)
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
  isReverseSort,
  setIsReverseSort,
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
        isReverseSort,
        setIsReverseSort,
      })
    },
    [
      account,
      handleOverviewResize,
      hasTransactions,
      isLoading,
      isReverseSort,
      setIsReverseSort,
      transactions,
    ]
  )
}

export function useItemSize(isEmptyState: boolean) {
  const overviewHeightRef = useRef(0)

  const getItemSize = useCallback(
    (index: number) => {
      if (index < FIXED_ROWS.length) {
        return FIXED_ROWS[index].getSize({
          overviewHeightRef,
          isEmptyState,
        })
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
    // If initially loading or if no transactions, we need to render the loader or empty state.
    if (isLoading || !hasTransactions) return FIXED_ROW_COUNT + 1

    // If there are more transactions to load, we add an extra row for the loader.
    if (hasNextPage) return transactions.length + FIXED_ROW_COUNT + 1

    // Otherwise, the count is just the number of transactions plus the fixed rows.
    return transactions.length + FIXED_ROW_COUNT
  }, [hasNextPage, isLoading, transactions.length, hasTransactions])
}

import { useCallback, useMemo, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Box } from '@ironfish/ui-kit'
import Account from 'Types/Account'
import { usePaginatedAccountTransactions } from 'Hooks/transactions/usePaginatedAccountTransactions'
import {
  useRowRenderer,
  useItemSize,
  useItemCount,
  FIXED_ROW_COUNT,
} from './listUtils'

type Props = {
  account: Account
}

export default function AccountOverview({ account }: Props) {
  const listRef = useRef<VariableSizeList>(null)
  const [isReverseSort, setIsReverseSort] = useState(true)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePaginatedAccountTransactions(account.id, isReverseSort)

  const transactions = useMemo(() => {
    return data?.pages.flatMap(item => item.transactions) ?? []
  }, [data?.pages])

  const hasTransactions = !isLoading && transactions.length > 0

  const { getItemSize, overviewHeightRef } = useItemSize(!hasTransactions)

  const handleOverviewResize = useCallback(
    (size: number) => {
      if (size === 0) {
        return
      }
      overviewHeightRef.current = size
      listRef.current?.resetAfterIndex(0)
    },
    [overviewHeightRef]
  )

  const rowRenderer = useRowRenderer({
    account,
    hasTransactions,
    isLoading,
    transactions,
    handleOverviewResize,
    isReverseSort,
    setIsReverseSort,
  })

  const itemCount = useItemCount({
    isLoading,
    hasTransactions,
    hasNextPage,
    transactions,
  })

  return (
    <Box w="100%">
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => {
          return (
            <InfiniteLoader
              isItemLoaded={index => {
                // If rendering a fixed row item, we can assume it's loaded.
                if (index < FIXED_ROW_COUNT) {
                  return true
                }
                // Otherwise, we need to check if we're rendering a transaction or the loading indicator.
                return !!transactions[index - FIXED_ROW_COUNT]
              }}
              itemCount={itemCount}
              loadMoreItems={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage()
                }
              }}
              threshold={2}
            >
              {({ onItemsRendered, ref }) => (
                <VariableSizeList
                  onItemsRendered={onItemsRendered}
                  ref={instance => {
                    ref(instance)
                    listRef.current = instance
                  }}
                  height={height}
                  width={width}
                  itemSize={getItemSize}
                  itemCount={itemCount}
                >
                  {rowRenderer}
                </VariableSizeList>
              )}
            </InfiniteLoader>
          )
        }}
      </AutoSizer>
    </Box>
  )
}

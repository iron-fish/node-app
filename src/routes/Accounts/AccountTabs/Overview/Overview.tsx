import { FC, useCallback, useEffect, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Box } from '@ironfish/ui-kit'
import Account from 'Types/Account'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import SearchTransactions from './SearchTransactions'
import AccountAssetsView from './AccountAssetsView'
import OverviewBalance from './OverviewBalance'

type Props = {
  account: Account
}

const AccountOverviewAlt: FC<Props> = ({ account }) => {
  return (
    <Box bg="darkslategray" pt="2rem">
      <SyncWarningMessage mb="2rem" />
      <OverviewBalance account={account} />
      <AccountAssetsView assets={account.balances.assets} />
      <Box>
        <SearchTransactions address={account.id} />
      </Box>
    </Box>
  )
}

function Overview({
  account,
  setSize,
}: Props & {
  setSize: (size: number) => void
}) {
  const wrapper = useRef<HTMLDivElement>()
  const observer = useRef(
    new ResizeObserver(entries => {
      const { height } = entries[0].contentRect
      setSize(height)
    })
  )

  useEffect(() => {
    if (wrapper.current) {
      observer.current.observe(wrapper.current)
    }

    return () => observer.current.unobserve(wrapper.current)
  }, [wrapper, observer])

  return (
    <Box ref={wrapper}>
      <SyncWarningMessage mb="2rem" />
      <OverviewBalance account={account} />
      <AccountAssetsView assets={account.balances.assets} />
    </Box>
  )
}

export default function AccountOverview({ account }: Props) {
  const listRef = useRef<VariableSizeList>(null)
  const [overviewHeight, setOverviewHeight] = useState(0)
  const getItemSize = useCallback(
    (index: number) => {
      if (index === 0) {
        return overviewHeight
      }
      return 200
    },
    [overviewHeight]
  )

  const rowRenderer = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (index === 0) {
        return (
          <Overview
            account={account}
            setSize={size => {
              setOverviewHeight(size)
              listRef.current?.resetAfterIndex(0, false)
            }}
          />
        )
      }

      return (
        <Box bg="pink" sx={style}>
          <h1>Hello {index}</h1>
        </Box>
      )
    },
    []
  )

  return (
    <Box bg="darkslategray" w="100%">
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => {
          return (
            <InfiniteLoader
              isItemLoaded={() => true}
              itemCount={1000}
              loadMoreItems={() => {
                //
              }}
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
                  itemCount={1000}
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

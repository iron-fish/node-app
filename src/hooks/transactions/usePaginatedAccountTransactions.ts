import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 20

export function usePaginatedAccountTransactions(
  accountId: string,
  reverse = true
) {
  return useInfiniteQuery(
    ['usePaginatedAccountTransactions', accountId, reverse],
    ({ pageParam = 0 }) => {
      return window.IronfishManager.transactions.getPaginatedTransactionsByAccountId(
        accountId,
        PAGE_SIZE,
        pageParam,
        reverse
      )
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextOffset = allPages.flatMap(page => page.transactions).length
        return lastPage.hasNext ? nextOffset : undefined
      },
      refetchOnWindowFocus: false,
    }
  )
}

import { useInfiniteQuery } from 'react-query'

const PAGE_SIZE = 20

export function usePaginatedAccountTransactions(accountId: string) {
  return useInfiniteQuery(
    ['usePaginatedAccountTransactions', accountId],
    ({ pageParam = 0 }) => {
      return window.IronfishManager.transactions.getPaginatedTransactionsByAccountId(
        accountId,
        PAGE_SIZE,
        pageParam
      )
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextOffset = allPages.flatMap(page => page.transactions).length
        return lastPage.hasNext ? nextOffset : undefined
      },
    }
  )
}

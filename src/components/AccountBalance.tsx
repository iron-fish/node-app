import { FC, ReactNode, useEffect } from 'react'
import useAccountBalance from 'Hooks/accounts/useAccountBalance'
import { Skeleton, SkeletonProps } from '@ironfish/ui-kit'
import Balance from 'Types/AccountBalance'
import { formatOreToTronWithLanguage } from 'Utils/number'

const AccountBalance: FC<{
  accountId: string
  skeletonProps?: SkeletonProps
  renderBalance?: (balance: Balance) => ReactNode
}> = ({
  accountId,
  skeletonProps,
  renderBalance = balance =>
    formatOreToTronWithLanguage(balance?.confirmed || BigInt(0)),
}) => {
  const [{ data: balance, loaded }, reload] = useAccountBalance(accountId)

  useEffect(() => {
    let interval: NodeJS.Timer
    if (loaded) {
      interval = setInterval(reload, 5000)
    }

    return () => interval && clearInterval(interval)
  }, [loaded])

  return (
    <Skeleton
      variant="ironFish"
      minW="4rem"
      {...skeletonProps}
      isLoaded={!!balance}
    >
      {renderBalance(balance)}&nbsp;$IRON
    </Skeleton>
  )
}

export default AccountBalance

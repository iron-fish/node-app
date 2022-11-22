import { FC, ReactNode } from 'react'
import useAccountBalance from 'Hooks/accounts/useAccountBalance'
import { Skeleton, SkeletonProps } from '@ironfish/ui-kit'
import Balance from 'Types/AccountBalance'
import { CurrencyUtils } from '@ironfish/sdk/build/src/utils/currency'

const AccountBalance: FC<{
  accountId: string
  skeletonProps?: SkeletonProps
  renderBalance?: (balance: Balance) => ReactNode
}> = ({
  accountId,
  skeletonProps,
  renderBalance = balance =>
    CurrencyUtils.renderIron(balance?.confirmed || '0'),
}) => {
  const { loaded, data: balance } = useAccountBalance(accountId)
  return (
    <Skeleton
      variant="ironFish"
      minW="4rem"
      {...skeletonProps}
      isLoaded={loaded}
    >
      {renderBalance(balance)}&nbsp;$IRON
    </Skeleton>
  )
}

export default AccountBalance

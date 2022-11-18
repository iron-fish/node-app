import { FC, ReactNode } from 'react'
import useAccountBalance from 'Hooks/accounts/useAccountBalance'
import { Skeleton, SkeletonProps } from '@ironfish/ui-kit'
import Balance from 'Types/AccountBalance'
import { oreToFormattedIron } from 'Utils/oreToIron'

const AccountBalance: FC<{
  accountId: string
  skeletonProps?: SkeletonProps
  renderBalance?: (balance: Balance) => ReactNode
}> = ({
  accountId,
  skeletonProps,
  renderBalance = balance => oreToFormattedIron(balance?.confirmed),
}) => {
  const { loaded, data: balance } = useAccountBalance(accountId)
  return (
    <Skeleton minW="4rem" {...skeletonProps} isLoaded={loaded}>
      {renderBalance(balance)}&nbsp;$IRON
    </Skeleton>
  )
}

export default AccountBalance

import { FC } from 'react'
import { Box } from '@ironfish/ui-kit'
import useTransactions from 'Hooks/transactions/useAccountTransactions'
import Account from 'Types/Account'
import EmptyOverview from 'Components/EmptyOverview'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import SearchTransactions from './SearchTransactions'
import AccountAssetsView from './AccountAssetsView'
import OverviewBalance from './OverviewBalance'

interface AccountOverviewProps {
  account: Account
}

const AccountOverview: FC<AccountOverviewProps> = ({ account }) => {
  const { data: transactions = undefined, loaded } = useTransactions(
    account?.id
  )

  return (
    <>
      <SyncWarningMessage mb="2rem" />
      <OverviewBalance account={account} />
      <AccountAssetsView assets={account.balances.assets} />
      <Box display={account.id && loaded ? 'block' : 'none'}>
        {transactions?.length === 0 ? (
          <EmptyOverview
            header="You don’t have any transactions"
            description="When your account compiles transactions they will be listed here. To produce a transactions, eitherF send or receive $IRON."
          />
        ) : (
          <SearchTransactions address={account.id} />
        )}
      </Box>
    </>
  )
}

export default AccountOverview

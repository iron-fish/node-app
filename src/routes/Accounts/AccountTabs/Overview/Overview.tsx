import { FC } from 'react'
import { Box } from '@ironfish/ui-kit'
import Account from 'Types/Account'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import SearchTransactions from './SearchTransactions'
import AccountAssetsView from './AccountAssetsView'
import OverviewBalance from './OverviewBalance'

interface AccountOverviewProps {
  account: Account
}

const AccountOverview: FC<AccountOverviewProps> = ({ account }) => {
  return (
    <>
      <SyncWarningMessage mb="2rem" />
      <OverviewBalance account={account} />
      <AccountAssetsView assets={account.balances.assets} />
      <Box>
        <SearchTransactions address={account.id} />
      </Box>
    </>
  )
}

export default AccountOverview

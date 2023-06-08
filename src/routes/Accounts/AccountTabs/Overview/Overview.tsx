import { FC } from 'react'
import { Box } from '@ironfish/ui-kit'
import Account from 'Types/Account'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import SearchTransactions from './SearchTransactions'
import AccountAssetsView from './AccountAssetsView'
import OverviewBalance from './OverviewBalance'
import { useDataSync } from 'Providers/DataSyncProvider'

interface AccountOverviewProps {
  account: Account
}

const AccountOverview: FC<AccountOverviewProps> = ({ account }) => {
  const { synced, data } = useDataSync()
  const blockchainHead = data?.blockchain.head
  const accountHead = data?.accounts.find(a => a.id === account?.id)?.sequence
  const showWarning = synced && Number(accountHead) < Number(blockchainHead) - 2

  return (
    <>
      {showWarning && <SyncWarningMessage mb="2rem" />}
      <OverviewBalance account={account} />
      <AccountAssetsView assets={account.balances.assets} />
      <Box>
        <SearchTransactions address={account.id} />
      </Box>
    </>
  )
}

export default AccountOverview

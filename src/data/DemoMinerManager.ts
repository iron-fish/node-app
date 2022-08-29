import {
  AccountMinerSpeed,
  AccountMinerStatistic,
  AccountMinerStatus,
} from './types/AccountMiner'

export const DEMO_MINER_STATUSES: AccountMinerStatus[] = [
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    status: 'stopped',
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    status: 'stopped',
  },
]

class DemoMinerManager {
  status(accountId: string): Promise<AccountMinerStatus> {
    const accountMinerStatus: AccountMinerStatus = DEMO_MINER_STATUSES.find(
      status => status.accountId === accountId
    )
    if (!accountMinerStatus) {
      DEMO_MINER_STATUSES.push({
        accountId: accountId,
        status: 'stopped',
      })
    }
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve(
            DEMO_MINER_STATUSES.find(status => status.accountId === accountId)
          ),
        500
      )
    })
  }

  statistic(
    accountId: string,
    from?: string,
    to?: string
  ): Promise<AccountMinerStatistic> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          amount: (Math.random() * 1000) / (from ? 10 : 1) / (to ? 10 : 1),
          from: from,
          to: to,
        })
      }, 500)
    })
  }

  speed(accountId: string): Promise<AccountMinerSpeed> {
    return new Promise(resolve => {
      setTimeout(() => {
        const status: AccountMinerStatus = DEMO_MINER_STATUSES.find(
          st => st.accountId === accountId
        )

        resolve({
          hashesPerSeccond:
            status?.status === 'active' ? Math.random() * 100 : 0,
        })
      }, 500)
    })
  }

  start(accountId: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const status: AccountMinerStatus = DEMO_MINER_STATUSES.find(
          st => st.accountId === accountId
        )

        status.status = 'active'

        resolve(true)
      }, 500)
    })
  }

  stop(accountId: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const status: AccountMinerStatus = DEMO_MINER_STATUSES.find(
          st => st.accountId === accountId
        )

        status.status = 'stopped'

        resolve(true)
      }, 500)
    })
  }
}

export default DemoMinerManager

import {
  MinerProps,
  MinedRecord,
  AccountMinerStatistic,
} from './types/AccountMiner'

export const DEMO_MINER_STATISTIC: MinedRecord[] = [
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    amount: 0.0035,
    date: new Date('2022-09-03T06:18:16.773Z'),
  },
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    amount: 0.0023,
    date: new Date('2022-09-03T06:22:16.773Z'),
  },
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    amount: 0.0055,
    date: new Date('2022-09-03T06:27:16.773Z'),
  },
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    amount: 0.0012,
    date: new Date('2022-09-03T06:34:16.773Z'),
  },
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    amount: 0.0028,
    date: new Date('2022-09-03T06:45:16.773Z'),
  },
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    amount: 0.0011,
    date: new Date('2022-09-03T06:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0011,
    date: new Date('2022-09-04T06:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0024,
    date: new Date('2022-09-05T06:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0034,
    date: new Date('2022-09-05T07:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0038,
    date: new Date('2022-09-25T07:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0054,
    date: new Date('2022-09-25T08:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0039,
    date: new Date('2022-09-26T08:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0049,
    date: new Date('2022-09-27T08:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0013,
    date: new Date('2022-09-28T08:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0034,
    date: new Date('2022-09-29T08:53:16.773Z'),
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    amount: 0.0055,
    date: new Date('2022-09-30T05:53:16.773Z'),
  },
]

class DemoMinerManager {
  miner: MinerProps
  speedUpdater: NodeJS.Timer | null
  minedRecordUpdater: NodeJS.Timer | null

  constructor() {
    this.miner = {
      status: 'stopped',
    }
  }

  status(): Promise<Pick<MinerProps, 'status'>> {
    return new Promise(resolve => {
      setTimeout(() => resolve({ status: this.miner.status }), 500)
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
          amount: DEMO_MINER_STATISTIC.filter(
            record =>
              record.accountId === accountId &&
              (!from || new Date(from) <= record.date) &&
              (!to || new Date(to) >= record.date)
          )
            .map(record => record.amount)
            .reduce((sum, amount) => (sum += amount), 0),
          from: from,
          to: to,
        })
      }, 500)
    })
  }

  speed(): Promise<Pick<MinerProps, 'speed'>> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          speed: this.miner.speed,
        })
      }, 500)
    })
  }

  start(accountId: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.miner = {
          status: 'active',
          accountId: accountId,
          mined: 0,
          speed: 0,
        }

        this.speedUpdater = setInterval(() => {
          this.miner.speed = Math.abs(
            this.miner.speed +
              (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100)
          )
        }, 250)
        this.minedRecordUpdater = setInterval(() => {
          if (Math.random() > 0.9) {
            DEMO_MINER_STATISTIC.push({
              accountId: this.miner.accountId,
              amount: Math.random() * 0.001,
              date: new Date(),
            })
          }
        }, 1000)

        resolve(true)
      }, 500)
    })
  }

  stop(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.miner = {
          status: 'stopped',
        }
        clearInterval(this.minedRecordUpdater)
        clearInterval(this.speedUpdater)

        resolve(true)
      }, 500)
    })
  }
}

export default DemoMinerManager

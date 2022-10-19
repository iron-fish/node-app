export interface MinerProps {
  accountId?: string
  status: 'active' | 'stopped'
  mined?: number
  speed?: number
}

export interface MinedRecord {
  accountId: string
  amount: number
  date: Date
}

export interface AccountMinerStatistic {
  from?: string
  to?: string
  amount: number
}

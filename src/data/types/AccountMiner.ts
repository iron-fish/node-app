export interface AccountMinerStatus {
  accountId: string
  status: 'active' | 'stopped'
}

export interface AccountMinerStatistic {
  from?: string
  to?: string
  amount: number
}

export interface AccountMinerSpeed {
  hashesPerSeccond: number
}

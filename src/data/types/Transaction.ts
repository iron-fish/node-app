export interface Transaction {
  creator: boolean
  status: string
  hash: string
  isMinersFee: boolean
  fee: number
  notes: TransactionNotes[]
  spends: number
  expiration: number
  from: string
  to: string
  created: string
  amount: number
}

export interface TransactionNotes {
  spender: boolean
  amount: number
  memo: string
}

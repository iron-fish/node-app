export interface Note {
  value: bigint
  memo: string
  sender: string
}

export interface Spend {
  nullifier: string
  commitment: string
  size: number
}

export interface Payment {
  amount: bigint
  memo: string
  publicAddress: string
}

export enum TransactionStatus {
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  PENDING = 'pending',
  UNCONFIRMED = 'unconfirmed',
  UNKNOWN = 'unknown',
}

export interface Transaction {
  accountId: string
  hash: string
  isMinersFee: boolean
  fee: string
  notesCount: number
  spendsCount: number
  expirationSequence: number
  status: TransactionStatus
  size: number
  blockHash: string
  notes: Note[]
  spends: Spend[]
  creator: boolean
  from: string
  to: string[]
  created: Date
  amount: string
}

export default Transaction

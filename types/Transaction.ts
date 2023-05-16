import Asset from './Asset'

export interface Note {
  value: bigint
  memo: string
  sender: string
  owner: string
  asset: Asset
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
  assetId: string
}

export enum TransactionStatus {
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  PENDING = 'pending',
  UNCONFIRMED = 'unconfirmed',
  UNKNOWN = 'unknown',
}

export interface Amount {
  value: bigint
  asset: Asset
}

export interface Transaction {
  accountId: string
  hash: string
  isMinersFee: boolean
  fee: string
  notesCount: number
  spendsCount: number
  expiration: number
  status: TransactionStatus
  size: number
  blockHash: string
  inputs: Note[]
  outputs: Note[]
  spends: Spend[]
  creator: boolean
  from: string
  to: string[]
  created: Date
  amount: Amount
  assetAmounts: Amount[]
}

export default Transaction

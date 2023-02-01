import SortType from '../SortType'
import Transaction, { Payment } from '../Transaction'

export enum IronfishTransactionManagerAction {
  GET = 'get',
  SEND = 'send',
  FEES = 'fees',
  AVERAGE_FEE = 'averageFee',
  ESTIMATE_FEE = 'estimateFeeWithPriority',
  FIND_BY_ACCOUNT_ID = 'findByAccountId',
  FIND_BY_ADDRESS = 'findByAddress',
}

export interface TransactionFeeStatistic {
  startBlock: number
  endBlock: number
  p25: bigint
  p50: bigint
  p75: bigint
  p100: bigint
}

export interface RawTransactionFee {
  serializedTxn: Buffer
  fee: bigint
}
export interface TransactionFeeEstimate {
  low: RawTransactionFee
  medium: RawTransactionFee
  high: RawTransactionFee
}

export interface TransactionReceiver {
  publicAddress: string
  amount: bigint
  memo: string
}

export interface IIronfishTransactionManager {
  get: (hash: string, accountId: string) => Promise<Transaction>
  send: (
    accountId: string,
    payment: Payment,
    transactionFee?: bigint
  ) => Promise<Transaction>
  sendTxn: (accountId: string, serializedTxn: Buffer) => Promise<Transaction>
  fees: (numOfBlocks?: number) => Promise<TransactionFeeStatistic>
  averageFee: (numOfBlocks?: number) => Promise<bigint>
  estimateFeeWithPriority: (
    accountId: string,
    receive: TransactionReceiver
  ) => Promise<TransactionFeeEstimate>
  findByAccountId: (
    accountId: string,
    searchTerm?: string,
    sort?: SortType
  ) => Promise<Transaction[]>
  findByAddress: (
    address: string,
    searchTerm?: string,
    sort?: SortType
  ) => Promise<Transaction[]>
}

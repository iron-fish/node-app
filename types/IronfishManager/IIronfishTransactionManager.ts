import SortType from '../SortType'
import Transaction, { Payment } from '../Transaction'

export enum IronfishTransactionManagerAction {
  AVERAGE_FEE = 'averageFee',
  ESTIMATE_FEE = 'estimateFeeWithPriority',
  FEES = 'fees',
  FIND_BY_ACCOUNT_ID = 'findByAccountId',
  FIND_BY_ADDRESS = 'findByAddress',
  GET = 'get',
  SEND = 'send',
}

export interface TransactionFeeStatistic {
  startBlock: number
  endBlock: number
  p25: bigint
  p50: bigint
  p75: bigint
  p100: bigint
}

export interface TransactionFeeEstimate {
  slow?: bigint
  average?: bigint
  fast?: bigint
}

export interface IIronfishTransactionManager {
  averageFee: (numOfBlocks?: number) => Promise<bigint>
  estimateFeeWithPriority: (
    accountId: string,
    receive: Payment
  ) => Promise<TransactionFeeEstimate>
  fees: (numOfBlocks?: number) => Promise<TransactionFeeStatistic>
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
  get: (hash: string, accountId: string) => Promise<Transaction>
  send: (
    accountId: string,
    payment: Payment,
    transactionFee?: bigint
  ) => Promise<Transaction>
}

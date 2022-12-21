import SortType from '../SortType'
import Transaction, { Payment } from '../Transaction'

export enum IronfishTransactionManagerAction {
  GET = 'get',
  PAY = 'pay',
  FEES = 'fees',
  AVERAGE_FEE = 'averageFee',
  FIND_BY_ACCOUNT_ID = 'findByAccountId',
  FIND_BY_ADDRESS = 'findByAddress',
}

export interface TransactionFeeStatistic {
  startBlock: number
  endBlock: number
  p25: number
  p50: number
  p75: number
  p100: number
}

export interface IIronfishTransactionManager {
  get: (hash: string, accountId: string) => Promise<Transaction>
  pay: (
    accountId: string,
    payment: Payment,
    transactionFee?: number
  ) => Promise<Transaction>
  fees: (numOfBlocks?: number) => Promise<TransactionFeeStatistic>
  averageFee: (numOfBlocks?: number) => Promise<number>
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

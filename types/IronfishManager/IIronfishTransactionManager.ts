import SortType from '../SortType'
import Transaction, { Payment } from '../Transaction'

export enum IronfishTransactionManagerAction {
  ESTIMATE_FEE = 'estimateFeeWithPriority',
  FIND_BY_ACCOUNT_ID = 'findByAccountId',
  FIND_BY_ADDRESS = 'findByAddress',
  GET = 'get',
  SEND = 'send',
}

export interface TransactionFeeEstimate {
  slow?: bigint
  average?: bigint
  fast?: bigint
}

export interface IIronfishTransactionManager {
  estimateFeeWithPriority: (
    accountId: string,
    receive: Payment
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
  get: (hash: string, accountId: string) => Promise<Transaction>
  send: (
    accountId: string,
    payment: Payment,
    transactionFee?: bigint
  ) => Promise<Transaction>
}

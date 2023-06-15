import SortType from '../SortType'
import Transaction, { Payment } from '../Transaction'

export enum IronfishTransactionManagerAction {
  ESTIMATE_FEE = 'estimateFeeWithPriority',
  FIND_BY_ACCOUNT_ID = 'findByAccountId',
  GET_PAGINATED_TRANSACTIONS_BY_ACCOUNT_ID = 'getPaginatedTransactionsByAccountId',
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
  getPaginatedTransactionsByAccountId: (
    accountId: string,
    count?: number,
    offset?: number,
    reverse?: boolean
  ) => Promise<{
    transactions: Transaction[]
    hasNext: boolean
  }>
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

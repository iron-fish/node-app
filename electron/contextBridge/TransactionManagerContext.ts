import {
  IIronfishTransactionManager,
  IronfishTransactionManagerAction,
} from 'Types/IronfishManager/IIronfishTransactionManager'
import SortType from 'Types/SortType'
import { Payment } from 'Types/Transaction'
import { invoke } from './util'

class TransactionManagerContext implements IIronfishTransactionManager {
  estimateFeeWithPriority = (accountId: string, receive: Payment) => {
    return invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.ESTIMATE_FEE,
      accountId,
      receive
    )
  }

  findByAccountId = (
    accountId: string,
    searchTerm?: string,
    sort?: SortType
  ) => {
    return invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.FIND_BY_ACCOUNT_ID,
      accountId,
      searchTerm,
      sort
    )
  }

  getPaginatedTransactionsByAccountId = (
    accountId: string,
    count?: number,
    offset?: number,
    reverse?: boolean
  ) => {
    return invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.GET_PAGINATED_TRANSACTIONS_BY_ACCOUNT_ID,
      accountId,
      count,
      offset,
      reverse
    )
  }

  findByAddress = (address: string, searchTerm?: string, sort?: SortType) => {
    return invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.FIND_BY_ADDRESS,
      address,
      searchTerm,
      sort
    )
  }

  get = (hash: string, accountId: string) => {
    return invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.GET,
      hash,
      accountId
    )
  }

  send = (accountId: string, payment: Payment, transactionFee?: bigint) => {
    return invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.SEND,
      accountId,
      payment,
      transactionFee
    )
  }
}

export default new TransactionManagerContext()

import { ipcRenderer } from 'electron'
import {
  IIronfishTransactionManager,
  IronfishTransactionManagerAction,
} from 'Types/IronfishManager/IIronfishTransactionManager'
import SortType from 'Types/SortType'
import { Payment } from 'Types/Transaction'

class TransactionManagerContext implements IIronfishTransactionManager {
  estimateFeeWithPriority = (accountId: string, receive: Payment) => {
    return ipcRenderer.invoke(
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
    return ipcRenderer.invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.FIND_BY_ACCOUNT_ID,
      accountId,
      searchTerm,
      sort
    )
  }

  findByAddress = (address: string, searchTerm?: string, sort?: SortType) => {
    return ipcRenderer.invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.FIND_BY_ADDRESS,
      address,
      searchTerm,
      sort
    )
  }

  get = (hash: string, accountId: string) => {
    return ipcRenderer.invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.GET,
      hash,
      accountId
    )
  }

  send = (accountId: string, payment: Payment, transactionFee?: bigint) => {
    return ipcRenderer.invoke(
      'ironfish-manager-transactions',
      IronfishTransactionManagerAction.SEND,
      accountId,
      payment,
      transactionFee
    )
  }
}

export default new TransactionManagerContext()

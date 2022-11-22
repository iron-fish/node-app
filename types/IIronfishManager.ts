import { AccountValue, PeerResponse } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'
import CutAccount from './CutAccount'
import IronFishInitStatus from './IronfishInitStatus'
import SortType from './SortType'
import Transaction, { Payment } from './Transaction'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import Account from './Account'

export enum IronfishManagerAction {
  INITIALIZE = 'initialize',
  START = 'start',
  STOP = 'stop',
  STATUS = 'status',
  NODE_STATUS = 'nodeStatus',
  PEERS = 'peers',
  HAS_ANY_ACCOUNT = 'hasAnyAccount',
}

export enum IronfishAccountManagerAction {
  CREATE = 'create',
  LIST = 'list',
  GET = 'get',
  DELETE = 'delete',
  BALANCE = 'balance',
  IMPORT = 'import',
  EXPORT = 'export',
}

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

export interface IIronfishAccountManager {
  create: (name: string) => Promise<Account>
  list: (search?: string, sort?: SortType) => Promise<CutAccount[]>
  get: (id: string) => Promise<Account>
  delete: (name: string) => Promise<void>
  import: (account: Omit<AccountValue, 'id'>) => Promise<AccountValue>
  export: (id: string) => Promise<AccountValue>
  balance: (id: string) => Promise<AccountBalance>
}

export interface IIronfishManager {
  accounts: IIronfishAccountManager
  transactions: IIronfishTransactionManager
  initialize: () => Promise<void>
  hasAnyAccount: () => Promise<boolean>
  start: () => Promise<void>
  stop: () => Promise<void>
  status: () => Promise<IronFishInitStatus>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<PeerResponse[]>
}

export default IIronfishManager

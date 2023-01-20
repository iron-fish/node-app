import { AccountValue, ConfigOptions, PeerResponse } from '@ironfish/sdk'
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
  SYNC = 'sync',
  GET_NODE_CONFIG = 'getNodeConfig',
  SAVE_NODE_CONFIG = 'saveNodeConfig',
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

export interface TransactionFeeEstimate {
  low: bigint
  medium: bigint
  high: bigint
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

export interface IIronfishAccountManager {
  create: (name: string) => Promise<Account>
  list: (search?: string, sort?: SortType) => Promise<CutAccount[]>
  get: (id: string) => Promise<Account>
  delete: (name: string) => Promise<void>
  import: (account: Omit<AccountValue, 'id'>) => Promise<AccountValue>
  export: (id: string) => Promise<Omit<AccountValue, 'id'>>
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
  sync: () => Promise<void>
  nodeStatus: () => Promise<NodeStatusResponse>
  peers: () => Promise<PeerResponse[]>
  getNodeConfig: () => Promise<Partial<ConfigOptions>>
  saveNodeConfig: (values: Partial<ConfigOptions>) => Promise<void>
}

export interface INodeSettingsManager {
  getConfig: () => Partial<ConfigOptions>
  setValues: (values: Partial<ConfigOptions>) => void
  save: () => Promise<void>
  clearConfig: () => void
}

export default IIronfishManager

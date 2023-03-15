import { AccountValue, ConfigOptions } from '@ironfish/sdk'
import { nanoid } from 'nanoid'
import uniqueId from 'lodash/uniqueId'
import AccountBalance from 'Types/AccountBalance'
import CutAccount from 'Types/CutAccount'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import Peer from 'Types/Peer'
import SortType from 'Types/SortType'
import DemoAccountsManager from './DemoAccountsManager'
import DemoAddressBookManager from './DemoAddressBookManager'
import DemoMinerManager from './DemoMinerManager'
import DemoNodeManager from './DemoNodeManager'
import DemoTransactionsManager from './DemoTransactionsManager'
import { AccountSettings } from './types/Account'
import { AccountMinerStatistic, MinerProps } from './types/AccountMiner'
import { Contact } from './types/Contact'
import Transaction from 'Types/Transaction'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import DemoAssetManager from './DemoAssetManager'
import Account from 'Types/Account'
import DemoNodeSettingsManager from './DemoNodeSettingsManager'

class DemoDataManager {
  accounts: DemoAccountsManager
  assets: DemoAssetManager
  transactions: DemoTransactionsManager
  nodeSettings: DemoNodeSettingsManager
  addressBook: DemoAddressBookManager
  miner: DemoMinerManager
  node: DemoNodeManager
  status: IronFishInitStatus

  constructor() {
    this.accounts = new DemoAccountsManager()
    this.assets = new DemoAssetManager()
    this.transactions = new DemoTransactionsManager()
    this.addressBook = new DemoAddressBookManager()
    this.miner = new DemoMinerManager()
    this.node = new DemoNodeManager()
    this.nodeSettings = new DemoNodeSettingsManager()
    this.status = IronFishInitStatus.NOT_STARTED
  }

  initStatus(): Promise<IronFishInitStatus> {
    return Promise.resolve(this.status)
  }

  async initialize(): Promise<void> {
    this.status = IronFishInitStatus.INITIALIZING_SDK
    await new Promise(resolve =>
      setTimeout(() => {
        this.status = IronFishInitStatus.INITIALIZING_NODE
        resolve(undefined)
      }, 2000)
    )
    await new Promise(resolve =>
      setTimeout(() => {
        this.status = IronFishInitStatus.INITIALIZED
        resolve(undefined)
      }, 2000)
    )
  }

  async start(): Promise<void> {
    this.status = IronFishInitStatus.STARTING_NODE
    await new Promise(resolve =>
      setTimeout(() => {
        this.status = IronFishInitStatus.STARTED
        resolve(undefined)
      }, 2000)
    )
  }

  async stop(): Promise<void> {
    await new Promise(resolve =>
      setTimeout(() => {
        this.status = IronFishInitStatus.NOT_STARTED
        resolve(undefined)
      }, 2000)
    )
  }

  async hasAnyAccount(): Promise<boolean> {
    const accounts = await this.accounts.list()
    return Promise.resolve(accounts.length > 0)
  }

  createAccount(name: string): Promise<AccountValue> {
    return this.accounts.create(name)
  }

  importAccount(account: Omit<AccountValue, 'id'>): Promise<AccountValue> {
    return this.accounts.import(account)
  }
  importByMnemonic(name: string, mnemonic: string): Promise<AccountValue> {
    const account = {
      id: nanoid(64),
      incomingViewKey: nanoid(64),
      outgoingViewKey: nanoid(64),
      name: name,
      publicAddress: nanoid(64),
      spendingKey: nanoid(64),
      viewKey: nanoid(64),
      version: 1,
    }
    return this.accounts.import(account)
  }
  importByEncodedKey(data: string): Promise<AccountValue> {
    const account = {
      id: nanoid(64),
      incomingViewKey: nanoid(64),
      outgoingViewKey: nanoid(64),
      name: uniqueId('Imported Account'),
      publicAddress: nanoid(64),
      spendingKey: nanoid(64),
      viewKey: nanoid(64),
      version: 1,
    }
    return this.accounts.import(account)
  }

  getAccounts(searchTerm?: string, sort?: SortType): Promise<CutAccount[]> {
    return this.accounts.list(searchTerm || '', sort)
  }

  getAccount(accountId: string): Promise<Account> {
    return this.accounts.findById(accountId)
  }

  updateAccount(identity: string, name: string): Promise<AccountValue> {
    return this.accounts.update(identity, name)
  }

  deleteAccount(identity: string): Promise<void> {
    return this.accounts.delete(identity)
  }

  getAccountSettings(accountId: string): Promise<AccountSettings> {
    return this.accounts.settings(accountId)
  }

  updateAccountSettings(
    accountId: string,
    currency: string
  ): Promise<AccountSettings> {
    return this.accounts.updateSettings(accountId, currency)
  }

  getBalance(accountId: string): Promise<AccountBalance> {
    return this.accounts.balance(accountId)
  }

  findTransactionsByAddress(
    address: string,
    search?: string,
    sort?: SortType
  ): Promise<Transaction[]> {
    return this.transactions.findByAddress(address, search, sort)
  }

  calculateFee(amount: number): Promise<number> {
    return this.transactions.calculateFee(amount)
  }

  sendTransaction(
    accountId: string,
    from: string,
    to: string,
    amount: bigint,
    memo: string,
    fee: bigint
  ): Promise<Transaction> {
    return this.transactions.send(accountId, from, to, amount, memo, fee)
  }

  getAddressBook(search: string, sort?: SortType): Promise<Contact[]> {
    return this.addressBook.list(search, sort)
  }

  getContact(identity: string): Promise<Contact> {
    return this.addressBook.findById(identity)
  }

  updateContact(
    identity: string,
    name: string,
    address: string
  ): Promise<string> {
    return this.addressBook.update(identity, name, address)
  }

  deleteContact(identity: string): Promise<boolean> {
    return this.addressBook.delete(identity)
  }

  addContact(name: string, address: string): Promise<string> {
    return this.addressBook.add(name, address)
  }

  getAccountMinerStatus(): Promise<Pick<MinerProps, 'status'>> {
    return this.miner.status()
  }

  getAccountMinerStatistic(
    accountId: string,
    from?: string,
    to?: string
  ): Promise<AccountMinerStatistic> {
    return this.miner.statistic(accountId, from, to)
  }

  getAccountMinerSpeed(): Promise<Pick<MinerProps, 'speed'>> {
    return this.miner.speed()
  }

  startMining(accountId: string): Promise<boolean> {
    return this.miner.start(accountId)
  }

  stopMining(): Promise<boolean> {
    return this.miner.stop()
  }

  getNodeStatus(): Promise<NodeStatusResponse> {
    return this.node.status()
  }

  getNodePeers(): Promise<Peer[]> {
    return this.node.peers()
  }

  async getNodeConfig(): Promise<Partial<ConfigOptions>> {
    return this.nodeSettings.getConfig()
  }

  async saveNodeConfig(values: Partial<ConfigOptions>): Promise<void> {
    this.nodeSettings.setValues(values)
    await this.nodeSettings.save()
    await this.stop()
    await this.initialize()
    return this.start()
  }
}

export default DemoDataManager

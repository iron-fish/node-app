import { GetStatusResponse, PeerResponse } from '@ironfish/sdk'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'
import SortType from 'Types/SortType'
import DemoAccountsManager from './DemoAccountsManager'
import DemoAddressBookManager from './DemoAddressBookManager'
import DemoMinerManager from './DemoMinerManager'
import DemoNodeManager from './DemoNodeManager'
import DemoTransactionsManager from './DemoTransactionsManager'
import { Account, AccountKeys, AccountSettings } from './types/Account'
import { AccountMinerStatistic, MinerProps } from './types/AccountMiner'
import { Contact } from './types/Contact'
import { Transaction } from './types/Transaction'

class DemoDataManager {
  accounts: DemoAccountsManager
  transactions: DemoTransactionsManager
  addressBook: DemoAddressBookManager
  miner: DemoMinerManager
  node: DemoNodeManager

  constructor() {
    this.accounts = new DemoAccountsManager()
    this.transactions = new DemoTransactionsManager()
    this.addressBook = new DemoAddressBookManager()
    this.miner = new DemoMinerManager()
    this.node = new DemoNodeManager()
  }

  createAccount(
    name: string,
    mnemonicPhrase: MnemonicPhraseType
  ): Promise<string> {
    return this.accounts.create(name, mnemonicPhrase)
  }

  generateMnemonic(): Promise<string[]> {
    return this.accounts.generateMnemonicPhrase()
  }

  importAccountBySpendingKey(spendingKey: string): Promise<string> {
    return this.accounts.importBySpendingKey(spendingKey)
  }

  importAccountByMnemonicPhrase(
    mnemonicPhrase: MnemonicPhraseType
  ): Promise<string> {
    return this.accounts.importByMnemonicPhrase(mnemonicPhrase)
  }

  importAccountByFile(file: File): Promise<string> {
    return this.accounts.importByFile(file)
  }

  getAccounts(searchTerm?: string): Promise<Account[]> {
    return this.accounts.list(searchTerm || '')
  }

  getAccount(accountId: string): Promise<Account> {
    return this.accounts.findById(accountId)
  }

  updateAccount(identity: string, name: string): Promise<Account> {
    return this.accounts.update(identity, name)
  }

  deleteAccount(identity: string): Promise<boolean> {
    return this.accounts.delete(identity)
  }

  getAccountKeys(accountId: string): Promise<AccountKeys> {
    return this.accounts.keys(accountId)
  }

  updateAccountKeys(accountKeys: AccountKeys): Promise<AccountKeys> {
    return this.accounts.updateKeys(accountKeys)
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
    from: string,
    to: string,
    amount: number,
    memo: string,
    fee: number
  ): Promise<string> {
    return this.transactions.send(from, to, amount, memo, fee)
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

  getNodeStatus(): Promise<GetStatusResponse> {
    return this.node.status()
  }

  getNodePeers(): Promise<PeerResponse[]> {
    return this.node.peers()
  }

  syncNodeData(): Promise<void> {
    return this.node.syncData()
  }
}

export default DemoDataManager

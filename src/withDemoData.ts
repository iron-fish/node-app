import { AccountValue } from '@ironfish/sdk'
import noop from 'lodash/noop'
import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IIronfishManager from 'Types/IIronfishManager'
import IStorage from 'Types/IStorage'
import SortType from 'Types/SortType'

export const IronFishManager: IIronfishManager = {
  accounts: {
    create: (name: string) => window.DemoDataManager.createAccount(name),
    delete: (name: string) => window.DemoDataManager.deleteAccount(name),
    export: (id: string) => window.DemoDataManager.getAccount(id),
    get: (id: string) => window.DemoDataManager.getAccount(id),
    import: (account: AccountValue) =>
      window.DemoDataManager.createAccount(account.name),
    list: (search: string, sort: SortType) =>
      window.DemoDataManager.getAccounts(search, sort),
    balance: (id: string) => window.DemoDataManager.getBalance(id),
  },
  transactions: {
    averageFee: (numOfBlocks?) => {
      return Promise.resolve(Math.random() * 10)
    },
    fees: (numOfBlocks?) => {
      return Promise.resolve({
        startBlock: 0,
        endBlock: 100,
        p25: 0.25,
        p50: 0.5,
        p75: 0.75,
        p100: 1,
      })
    },
    findByAccountId: (accountId, searchTerm?, sort?) => {
      return window.DemoDataManager.transactions.findByAccountId(
        accountId,
        searchTerm,
        sort
      )
    },
    findByAddress: (address, searchTerm?, sort?) => {
      return window.DemoDataManager.transactions.findByAddress(
        address,
        searchTerm,
        sort
      )
    },
    get: (hash, accountId) =>
      window.DemoDataManager.transactions.get(hash, accountId),
    pay: (accountId, payment, transactionFee?) =>
      window.DemoDataManager.transactions.send(
        accountId,
        accountId,
        payment.publicAddress,
        Number(payment.amount),
        payment.memo,
        transactionFee || 0.5
      ),
  },
  nodeStatus: () => window.DemoDataManager.getNodeStatus(),
  peers: () => window.DemoDataManager.getNodePeers(),
  hasAnyAccount: () => window.DemoDataManager.hasAnyAccount(),
  initialize: () => window.DemoDataManager.initialize(),
  start: () => window.DemoDataManager.start(),
  stop: () => window.DemoDataManager.stop(),
  status: () => window.DemoDataManager.initStatus(),
}

export const AddressBookStorage: IStorage<Contact> = {
  add: (entity: Omit<Contact, '_id'>) =>
    window.DemoDataManager.addContact(entity.name, entity.address).then(
      identity => ({
        _id: identity,
        ...entity,
      })
    ),
  delete: (identity: string) =>
    window.DemoDataManager.deleteContact(identity).then(noop),
  find: (entity: Partial<Omit<Contact, '_id'>>) =>
    window.DemoDataManager.getAddressBook(entity.name)
      .then(data => (data.length > 0 ? data[0] : null))
      .then(contact => ({
        _id: contact.identity,
        ...contact,
      })),
  get: (identity: string) =>
    window.DemoDataManager.getContact(identity).then(contact => ({
      _id: contact.identity,
      ...contact,
    })),
  list: (searchTerm: string, sort: SortType) =>
    window.DemoDataManager.getAddressBook(searchTerm, sort).then(contacts =>
      contacts.map(contact => ({
        _id: contact.identity,
        ...contact,
      }))
    ),
  update: (identity: string, fieldsToUpdate: Partial<Omit<Contact, '_id'>>) =>
    window.DemoDataManager.updateContact(
      identity,
      fieldsToUpdate.name,
      fieldsToUpdate.address
    ).then(() => ({
      _id: identity,
      name: fieldsToUpdate.name,
      address: fieldsToUpdate.address,
    })),
}

export const AccountSettingsStorage: IStorage<AccountSettings> = {
  add: (entity: Omit<AccountSettings, '_id'>) =>
    window.DemoDataManager.getAccountSettings(entity.accountId).then(
      settings => ({
        _id: settings.accountId,
        ...settings,
      })
    ),
  delete: (identity: string) => Promise.resolve(),
  find: (entity: Partial<Omit<AccountSettings, '_id'>>) =>
    Promise.resolve(null),
  get: (identity: string) =>
    window.DemoDataManager.getAccountSettings(identity).then(settings => ({
      _id: settings.accountId,
      ...settings,
    })),
  list: (searchTerm: string, sort: SortType) => Promise.resolve([]),
  update: (
    identity: string,
    fieldsToUpdate: Partial<Omit<AccountSettings, '_id'>>
  ) =>
    window.DemoDataManager.updateAccountSettings(
      identity,
      fieldsToUpdate.currency
    ).then(() => ({
      _id: identity,
      accountId: identity,
      currency: fieldsToUpdate.currency,
    })),
}

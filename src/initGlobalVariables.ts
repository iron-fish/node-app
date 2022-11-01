import DemoDataManager from './data/DemoDataManager'
// import { IronfishSdk } from '@ironfish/sdk'
import IStorage from 'Types/IStorage'
import Contact from 'Types/Contact'
import AccountSettings from 'Types/AccountSettings'
import SortType from 'Types/SortType'
import noop from 'lodash/noop'
import IIronfishManager from 'Types/IIronfishManager'
import { AccountValue } from '@ironfish/sdk'

declare global {
  interface Window {
    DemoDataManager: DemoDataManager
    // Wallet: IronfishSdk
    AddressBookStorage: IStorage<Contact>
    AccountSettingsStorage: IStorage<AccountSettings>
    setElectronThemeMode: (mode: string) => void
    IronfishManager: IIronfishManager
  }
}
window.DemoDataManager = new DemoDataManager()
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
}

if (!window.IronfishManager) {
  window.IronfishManager = {
    accounts: {
      create: (name: string) => window.DemoDataManager.createAccount(name),
      delete: (name: string) => window.DemoDataManager.deleteAccount(name),
      export: (id: string) => window.DemoDataManager.getAccount(id),
      get: (id: string) => window.DemoDataManager.getAccount(id),
      import: (account: AccountValue) =>
        window.DemoDataManager.createAccount(account.name),
      list: (search: string) => window.DemoDataManager.getAccounts(search),
      balance: (id: string) => window.DemoDataManager.getBalance(id),
    },
    nodeStatus: () => window.DemoDataManager.getNodeStatus(),
    peers: () => window.DemoDataManager.getNodePeers(),
    hasAnyAccount: () => window.DemoDataManager.hasAnyAccount(),
    initialize: () => window.DemoDataManager.initialize(),
    start: () => window.DemoDataManager.start(),
    stop: () => window.DemoDataManager.stop(),
    status: () => window.DemoDataManager.initStatus(),
  }
}

if (!window.AddressBookStorage) {
  window.AddressBookStorage = {
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
}

if (!window.AccountSettingsStorage) {
  window.AccountSettingsStorage = {
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
}

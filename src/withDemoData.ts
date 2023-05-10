import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IStorage from 'Types/IStorage'
import DemoUpdateManager from 'Data/DemoUpdateManager'
import DemoDataManager from 'Data/DemoDataManager'
import DemoAddressBookManager from 'Data/DemoAddressBookManager'
import DemoAccountSettingsManager from 'Data/DemoAccountSettingsManager'
import DemoErrorManager from 'Data/DemoErrorManager'

export const IronFishManager = new DemoDataManager()

export const AddressBookStorage: IStorage<Contact> =
  new DemoAddressBookManager()

export const AccountSettingsStorage: IStorage<AccountSettings> =
  new DemoAccountSettingsManager()

export const UpdateManager = new DemoUpdateManager()
UpdateManager.initialize()

export const ErrorManager = new DemoErrorManager()

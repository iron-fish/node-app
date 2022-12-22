import DemoDataManager from './data/DemoDataManager'
import IStorage from 'Types/IStorage'
import Contact from 'Types/Contact'
import AccountSettings from 'Types/AccountSettings'
import IIronfishManager from 'Types/IIronfishManager'

declare global {
  interface Window {
    //TODO: Remove DemoDataManager after full integration of @ironfish/sdk
    DemoDataManager: DemoDataManager
    AddressBookStorage: IStorage<Contact>
    AccountSettingsStorage: IStorage<AccountSettings>
    setElectronThemeMode: (mode: string) => void
    IronfishManager: IIronfishManager
  }
}

//TODO: Remove after full integration of @ironfish/sdk
window.DemoDataManager = new DemoDataManager()

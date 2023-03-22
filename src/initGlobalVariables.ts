import DemoDataManager from 'Data/DemoDataManager'
import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IIronfishManager from 'Types/IronfishManager/IIronfishManager'
import IStorage from 'Types/IStorage'

declare global {
  interface Window {
    //TODO: Remove DemoDataManager after full integration of @ironfish/sdk
    DemoDataManager: DemoDataManager
    AddressBookStorage: IStorage<Contact>
    AccountSettingsStorage: IStorage<AccountSettings>
    setElectronThemeMode: (mode: string) => void
    selectFolder: () => Promise<string>
    IronfishManager: IIronfishManager
  }
}

//TODO: Remove after full integration of @ironfish/sdk
window.DemoDataManager = new DemoDataManager()

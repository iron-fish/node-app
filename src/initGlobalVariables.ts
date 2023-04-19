import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import IIronfishManager from 'Types/IronfishManager/IIronfishManager'
import IStorage from 'Types/IStorage'
import { IUpdateManager, UpdateStatus } from 'Types/IUpdateManager'

declare global {
  interface Window {
    AddressBookStorage: IStorage<Contact>
    AccountSettingsStorage: IStorage<AccountSettings>
    setElectronThemeMode: (mode: string) => void
    selectFolder: () => Promise<string>
    subscribeOnInitStatusChange: (
      callback: (initStatus: IronFishInitStatus) => void
    ) => void
    subscribeOnAccountCountChange: (callback: (count: number) => void) => void
    subscribeOnAppUpdateReady: (
      callback: (status: UpdateStatus) => void
    ) => void
    IronfishManager: IIronfishManager
    UpdateManager: IUpdateManager
  }
}

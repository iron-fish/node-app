import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IErrorManager from 'Types/ErrorManagerTypes'
import EventType from 'Types/EventType'
import IIronfishManager from 'Types/IronfishManager/IIronfishManager'
import IStorage from 'Types/IStorage'
import { IUpdateManager } from 'Types/IUpdateManager'

declare global {
  interface Window {
    AddressBookStorage: IStorage<Contact>
    AccountSettingsStorage: IStorage<AccountSettings>
    setElectronThemeMode: (mode: string) => void
    selectFolder: () => Promise<string>
    subscribeOn: (type: EventType, callback: (...args: any[]) => void) => void
    IronfishManager: IIronfishManager
    UpdateManager: IUpdateManager
    ErrorManager: IErrorManager
  }
}

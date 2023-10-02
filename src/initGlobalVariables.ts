import { RpcIpcBridgeClient } from 'Providers/RpcIpcBridgeClient'
import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IErrorManager from 'Types/ErrorManagerTypes'
import EventType from 'Types/EventType'
import IIronfishManager from 'Types/IronfishManager/IIronfishManager'
import IStorage from 'Types/IStorage'
import { IUpdateManager } from 'Types/IUpdateManager'
import { ServerResponse } from 'Types/RpcServerResponse'

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
    RpcBridge: {
      onMessage: (
        callback: (
          messageId: number,
          stream: boolean,
          { data, error }: ServerResponse<unknown>
        ) => Promise<void>
      ) => void
      sendMessage: (messageId: number, route: string, data: unknown) => void
    }
    rpcClient: RpcIpcBridgeClient
  }
}

import { contextBridge, ipcRenderer } from 'electron'
import IronfishManagerContext from '../contextBridge/IronfishManagerContext'
import {
  AccountSettingsStorage,
  AddressBookStorage,
} from '../contextBridge/StorageContext'
import UpdateManagerContext from '../contextBridge/UpdateManagerContext'
import ErrorManagerContext from '../contextBridge/ErrorManagerContext'
import EventType from 'Types/EventType'
import { ServerResponse } from 'Types/RpcServerResponse'

contextBridge.exposeInMainWorld(
  'setElectronThemeMode',
  (mode: 'light' | 'dark' | 'system') => {
    ipcRenderer.invoke('theme-mode-change', mode)
  }
)
contextBridge.exposeInMainWorld('selectFolder', () =>
  ipcRenderer.invoke('dialog:openDirectory')
)

contextBridge.exposeInMainWorld('IronfishManager', IronfishManagerContext)

contextBridge.exposeInMainWorld('RpcBridge', {
  onMessage: (
    callback: (
      messageId: number,
      stream: boolean,
      { data, error }: ServerResponse<unknown>
    ) => Promise<void>
  ) => {
    ipcRenderer.on('ironfish-rpc-bridge', (e, messageId, stream, response) =>
      callback(messageId, stream, response)
    )
  },
  sendMessage: (messageId: number, route: string, data: unknown) => {
    ipcRenderer.invoke('ironfish-rpc-bridge', messageId, route, data)
  },
})

contextBridge.exposeInMainWorld('AddressBookStorage', AddressBookStorage)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  AccountSettingsStorage
)

contextBridge.exposeInMainWorld(
  'subscribeOn',
  (type: EventType, callback: (...args: any[]) => void) => {
    ipcRenderer.on(type, (e, ...args: any[]) => {
      callback(...args)
    })
  }
)

contextBridge.exposeInMainWorld('UpdateManager', UpdateManagerContext)
contextBridge.exposeInMainWorld('ErrorManager', ErrorManagerContext)

import { contextBridge, ipcRenderer } from 'electron'
import IronfishManagerContext from '../contextBridge/IronfishManagerContext'
import {
  AccountSettingsStorage,
  AddressBookStorage,
} from '../contextBridge/StorageContext'
import UpdateManagerContext from '../contextBridge/UpdateManagerContext'
import EventType from 'Types/EventType'
import '../common/preload'
import ErrorManagerContext from '../contextBridge/ErrorManagerContext'

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

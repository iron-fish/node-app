import { contextBridge, ipcRenderer } from 'electron'
import IronfishManagerContext from '../contextBridge/IronfishManagerContext'
import {
  AccountSettingsStorage,
  AddressBookStorage,
} from '../contextBridge/StorageContext'
import UpdateManagerContext from '../contextBridge/UpdateManagerContext'
import '../common/preload'
import IronFishInitStatus from 'Types/IronfishInitStatus'

contextBridge.exposeInMainWorld('IronfishManager', IronfishManagerContext)

contextBridge.exposeInMainWorld('AddressBookStorage', AddressBookStorage)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  AccountSettingsStorage
)
contextBridge.exposeInMainWorld(
  'subscribeOnInitStatusChange',
  (callback: (initStatus: IronFishInitStatus) => void) =>
    ipcRenderer.on('init-status-change', (e, initStatus: IronFishInitStatus) =>
      callback(initStatus)
    )
)

contextBridge.exposeInMainWorld('UpdateManager', UpdateManagerContext)

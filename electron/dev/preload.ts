import { contextBridge, ipcRenderer } from 'electron'
import IronfishManagerContext from '../contextBridge/IronfishManagerContext'
import {
  AccountSettingsStorage,
  AddressBookStorage,
} from '../contextBridge/StorageContext'
import UpdateManagerContext from '../contextBridge/UpdateManagerContext'
import '../common/preload'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import { ProgressType } from 'Types/IronfishManager/IIronfishSnapshotManager'

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
contextBridge.exposeInMainWorld(
  'subscribeOnAccountCountChange',
  (callback: (count: number) => void) =>
    ipcRenderer.on('account-count-change', (e, count: number) =>
      callback(count)
    )
)
contextBridge.exposeInMainWorld(
  'subscribeOnSnapshotStatusChange',
  (callback: (status: Omit<ProgressType, 'statistic'>) => void) =>
    ipcRenderer.on(
      'snapshot-status-change',
      (e, status: Omit<ProgressType, 'statistic'>) => callback(status)
    )
)

contextBridge.exposeInMainWorld('UpdateManager', UpdateManagerContext)

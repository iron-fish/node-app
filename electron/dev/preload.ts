import { contextBridge } from 'electron'
import IronfishManagerContext from '../contextBridge/IronfishManagerContext'
import {
  AccountSettingsStorage,
  AddressBookStorage,
} from '../contextBridge/StorageContext'
import UpdateManagerContext from '../contextBridge/UpdateManagerContext'
import '../common/preload'

contextBridge.exposeInMainWorld('IronfishManager', IronfishManagerContext)

contextBridge.exposeInMainWorld('AddressBookStorage', AddressBookStorage)
contextBridge.exposeInMainWorld(
  'AccountSettingsStorage',
  AccountSettingsStorage
)

contextBridge.exposeInMainWorld('UpdateManager', UpdateManagerContext)

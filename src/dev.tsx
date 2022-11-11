import './initGlobalVariables'
import {
  AccountSettingsStorage,
  AddressBookStorage,
  IromFishManager,
} from './withDemoData'
import noop from 'lodash/noop'

if (!window.IronfishManager) {
  window.IronfishManager = IromFishManager
}
if (!window.AddressBookStorage) {
  window.AddressBookStorage = AddressBookStorage
}
if (!window.AccountSettingsStorage) {
  window.AccountSettingsStorage = AccountSettingsStorage
}
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
}

import './init'

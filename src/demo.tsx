import './initGlobalVariables'
import {
  AccountSettingsStorage,
  AddressBookStorage,
  IromFishManager,
} from './withDemoData'
import noop from 'lodash/noop'

window.IronfishManager = IromFishManager
window.AddressBookStorage = AddressBookStorage
window.AccountSettingsStorage = AccountSettingsStorage
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
}

import './init'

import './initGlobalVariables'
import {
  AccountSettingsStorage,
  AddressBookStorage,
  IronFishManager,
} from './withDemoData'
import noop from 'lodash/noop'

window.IronfishManager = IronFishManager
window.AddressBookStorage = AddressBookStorage
window.AccountSettingsStorage = AccountSettingsStorage
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
}

import './init'

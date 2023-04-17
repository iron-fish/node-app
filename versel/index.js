/* eslint-disable @typescript-eslint/no-var-requires */

const demo = require('../src/withDemoData')

window.IronfishManager = demo.IronFishManager
window.AddressBookStorage = demo.AddressBookStorage
window.AccountSettingsStorage = demo.AccountSettingsStorage
window.UpdateManager = demo.UpdateManager
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = require('lodash/noop')
}

require('../src/init')

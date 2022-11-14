/* eslint-disable @typescript-eslint/no-var-requires */

require('../src/initGlobalVariables')
const demo = require('../src/withDemoData')

window.IronfishManager = demo.IronFishManager
window.AddressBookStorage = demo.AddressBookStorage
window.AccountSettingsStorage = demo.AccountSettingsStorage
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = require('lodash/noop')
}

require('../src/init')

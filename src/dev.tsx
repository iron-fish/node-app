import {
  AccountSettingsStorage,
  AddressBookStorage,
  IronFishManager,
  UpdateManager,
} from './withDemoData'
import noop from 'lodash/noop'

if (!window.IronfishManager) {
  window.IronfishManager = IronFishManager
}
if (!window.AddressBookStorage) {
  window.AddressBookStorage = AddressBookStorage
}
if (!window.AccountSettingsStorage) {
  window.AccountSettingsStorage = AccountSettingsStorage
}
if (!window.UpdateManager) {
  window.UpdateManager = UpdateManager
  window.UpdateManager.initialize()
}
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
}
if (!window.subscribeOnAccountCountChange) {
  window.subscribeOnAccountCountChange = callback => {
    document.addEventListener('account-count-change', (e: CustomEvent) => {
      callback(e.detail)
    })
  }
}
if (!window.subscribeOnInitStatusChange) {
  window.subscribeOnInitStatusChange = callback => {
    document.addEventListener('init-status-change', (e: CustomEvent) => {
      callback(e.detail)
    })
  }
}
if (!window.subscribeOnAppUpdateReady) {
  window.subscribeOnAppUpdateReady = callback => {
    document.addEventListener('app-update-ready', (e: CustomEvent) => {
      callback(e.detail)
    })
  }
}
if (!window.selectFolder) {
  window.selectFolder = () => {
    return new Promise(resolve => {
      const input = document.createElement('input')
      input.type = 'file'
      input.webkitdirectory = true
      // input.directory = true
      input.onchange = () => resolve('some/test/path')
      input.click()
    })
  }
}

import './init'

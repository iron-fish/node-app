import { contextBridge, ipcRenderer } from 'electron'
// import { IronfishSdk } from '@ironfish/sdk'

// contextBridge.exposeInMainWorld('Wallet', IronfishSdk)
contextBridge.exposeInMainWorld('setElectronThemeMode', mode => {
  ipcRenderer.invoke('theme-mode-change', mode)
})

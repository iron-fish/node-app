import { contextBridge, ipcRenderer } from 'electron'
import { IronfishSdk } from '@ironfish/sdk'

contextBridge.exposeInMainWorld('Wallet', IronfishSdk)

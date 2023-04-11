import { contextBridge, ipcRenderer } from 'electron'
import UpdateManagerContext from '../contextBridge/UpdateManagerContext'

contextBridge.exposeInMainWorld(
  'setElectronThemeMode',
  (mode: 'light' | 'dark' | 'system') => {
    ipcRenderer.invoke('theme-mode-change', mode)
  }
)
contextBridge.exposeInMainWorld('selectFolder', () =>
  ipcRenderer.invoke('dialog:openDirectory')
)

if (process.env.MODE !== 'demo') {
  contextBridge.exposeInMainWorld('UpdateManager', UpdateManagerContext)
}

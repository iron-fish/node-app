import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  'setElectronThemeMode',
  (mode: 'light' | 'dark' | 'system') => {
    ipcRenderer.invoke('theme-mode-change', mode)
  }
)
contextBridge.exposeInMainWorld('selectFolder', () =>
  ipcRenderer.invoke('dialog:openDirectory')
)

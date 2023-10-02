import { ipcMain } from 'electron'
import log from 'electron-log'
import { getMainWindow } from '../common/index'
import { getIronfishManager } from '../common/initHandlers'

log.transports.file.level = 'error'

ipcMain.handle('ironfish-rpc-bridge', async (e, messageId, route, data) => {
  const ironfishManager = getIronfishManager()
  const mainWindow = getMainWindow()
  const rpcResponse = ironfishManager.nodeClient.request(route, data)

  rpcResponse
    .waitForEnd()
    .then(response => {
      mainWindow.webContents.send('ironfish-rpc-bridge', messageId, false, {
        data: response.content,
      })
    })
    .catch(error => {
      mainWindow.webContents.send('ironfish-rpc-bridge', messageId, false, {
        data: null,
        error,
      })
    })

  try {
    for await (const response of rpcResponse.contentStream()) {
      mainWindow.webContents.send('ironfish-rpc-bridge', messageId, true, {
        data: response,
      })
    }
  } catch (error) {
    mainWindow.webContents.send('ironfish-rpc-bridge', messageId, true, {
      data: null,
      error,
    })
  }
})

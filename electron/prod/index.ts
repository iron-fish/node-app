import { ipcMain } from 'electron'
import log from 'electron-log'

import mainWindow from '../common/index'
import ironfishManager from '../common/initHandlers'

log.transports.file.level = 'error'

ipcMain.handle('ironfish-rpc-bridge', async (e, messageId, route, data) => {
  const rpcResponse = ironfishManager.ironfishManager.nodeClient.request(
    route,
    data
  )

  rpcResponse
    .waitForEnd()
    .then(response => {
      mainWindow.mainWindow.webContents.send(
        'ironfish-rpc-bridge',
        messageId,
        false,
        {
          data: response.content,
        }
      )
    })
    .catch(error => {
      mainWindow.mainWindow.webContents.send(
        'ironfish-rpc-bridge',
        messageId,
        false,
        {
          data: null,
          error,
        }
      )
    })

  try {
    for await (const response of rpcResponse.contentStream()) {
      mainWindow.mainWindow.webContents.send(
        'ironfish-rpc-bridge',
        messageId,
        true,
        {
          data: response,
        }
      )
    }
  } catch (error) {
    mainWindow.mainWindow.webContents.send(
      'ironfish-rpc-bridge',
      messageId,
      true,
      {
        data: null,
        error,
      }
    )
  }
})

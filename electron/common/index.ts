/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import './initLog'
import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  shell,
  dialog,
  crashReporter,
} from 'electron'
import log from 'electron-log'
import getAppHomeFolder from '../utils/getAppHomeFolder'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin (forge.config) that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const NODE_WEBPACK_ENTRY: string
declare const NODE_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

let mainWindow: BrowserWindow

const createWindow = () => {
  if (!mainWindow) {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      minHeight: 700,
      minWidth: 750,
      autoHideMenuBar: true,
      icon: __dirname + '/icons/icon.png',
      title: 'Iron Fish Node App',
      webPreferences: {
        enableRemoteModule: true,
        contextIsolation: true,
        // nodeIntegrationInWorker: true,
        preload: NODE_PRELOAD_WEBPACK_ENTRY,
      },
    })

    mainWindow.maximize()

    if (process.env.MODE === 'dev') {
      // Open the DevTools.
      mainWindow.webContents.openDevTools()
    }

    // and load the index.html of the app.
    mainWindow.loadURL(NODE_WEBPACK_ENTRY)

    mainWindow.webContents.on('new-window', (e, url) => {
      e.preventDefault()
      shell.openExternal(url)
    })
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

ipcMain.handle('theme-mode-change', (e, mode: 'light' | 'dark' | 'system') => {
  nativeTheme.themeSource = mode
})

ipcMain.handle('dialog:openDirectory', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  } catch (e) {
    log.error(e)
  }

  return
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => createWindow())

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

if (process.env.TEST_ERROR) {
  setTimeout(() => {
    throw new Error(
      'Test error in main process for modal view and dumping data'
    )
  }, 30000)
}

app.setPath('crashDumps', getAppHomeFolder('crashes'))
crashReporter.start({ uploadToServer: false })

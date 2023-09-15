/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { ipcMain } from 'electron'
import { IronfishManagerAction } from 'Types/IronfishManager/IIronfishManager'
import { IronfishAccountManagerAction } from 'Types/IronfishManager/IIronfishAccountManager'
import { IronfishSnaphotManagerAction } from 'Types/IronfishManager/IIronfishSnapshotManager'
import { IronfishTransactionManagerAction } from 'Types/IronfishManager/IIronfishTransactionManager'
import initStorageCallbacks from '../common/initStorage'
import { IronFishManager } from '../ironfish/IronFishManager'
import { IronfishAssetManagerActions } from 'Types/IronfishManager/IIronfishAssetManager'
import log from 'electron-log'
import UpdateManager from './UpdateManager'
import errorManager from '../utils/ErrorManager/ErrorManager'
import { ErrorManagerActions } from 'Types/ErrorManagerTypes'

const ironfishManager = new IronFishManager()
UpdateManager.initialize()
initStorageCallbacks(ipcMain)

log.log('Application started.')

async function shutdownNode() {
  return await ironfishManager.stop()
}

function handleError(error: unknown): {
  error: true
  message: string
  name?: string
  stack?: string
} {
  if (error.isAxiosError) {
    log.error(error?.code, '|', error?.config?.url, '|', error?.message)
  } else {
    log.error(error)
  }

  if (error instanceof Error) {
    return {
      error: true,
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  return {
    error: true,
    message: String(error),
  }
}

ipcMain.handle(
  'ironfish-manager',
  async (e, action: IronfishManagerAction, ...args): Promise<any> => {
    try {
      return { error: false, data: await ironfishManager[action](...args) }
    } catch (error) {
      return handleError(error)
    }
  }
)

ipcMain.handle(
  'ironfish-manager-assets',
  async (e, action: IronfishAssetManagerActions, ...args): Promise<any> => {
    try {
      return {
        error: false,
        data: await ironfishManager.assets[action](...args),
      }
    } catch (error) {
      return handleError(error)
    }
  }
)

ipcMain.handle(
  'ironfish-manager-accounts',
  async (e, action: IronfishAccountManagerAction, ...args): Promise<any> => {
    try {
      return {
        error: false,
        data: await ironfishManager.accounts[action](...args),
      }
    } catch (error) {
      return handleError(error)
    }
  }
)

ipcMain.handle(
  'ironfish-manager-transactions',
  async (
    e,
    action: IronfishTransactionManagerAction,
    ...args
  ): Promise<any> => {
    try {
      return {
        error: false,
        data: await ironfishManager.transactions[action](...args),
      }
    } catch (error) {
      return handleError(error)
    }
  }
)

ipcMain.handle(
  'ironfish-manager-snapshot',
  async (e, action: IronfishSnaphotManagerAction, ...args): Promise<any> => {
    try {
      return {
        error: false,
        data: await ironfishManager.snapshot[action](...args),
      }
    } catch (error) {
      return handleError(error)
    }
  }
)

ipcMain.handle(
  'update-manager',
  async (e, action: UpdateManagerAction, ...args) => {
    try {
      return { error: false, data: await UpdateManager[action](...args) }
    } catch (error) {
      return handleError(error)
    }
  }
)

ipcMain.handle(
  'error-manager',
  async (e, action: ErrorManagerActions, ...args) => {
    try {
      return { error: false, data: await errorManager[action](...args) }
    } catch (error) {
      return handleError(error)
    }
  }
)

log.errorHandler.startCatching({
  showDialog: false,
  onError({ error, versions }) {
    errorManager.addError(error)
    log.error('Version Info:', versions)
    log.error('Process Type:', processType)
    log.error(error)
  },
})

process.on('exit', shutdownNode)
process.on('SIGINT', shutdownNode)
process.on('SIGUSR1', shutdownNode)
process.on('SIGUSR2', shutdownNode)

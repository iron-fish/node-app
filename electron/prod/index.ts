/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { ipcMain } from 'electron'
import { IronfishManagerAction } from 'Types/IronfishManager/IIronfishManager'
import { IronfishAccountManagerAction } from 'Types/IronfishManager/IIronfishAccountManager'
import { IronfishSnaphotManagerAction } from 'Types/IronfishManager/IIronfishSnapshotManager'
import { IronfishTransactionManagerAction } from 'Types/IronfishManager/IIronfishTransactionManager'
import path from 'path'
import initStorageCallbacks from '../common/initStorage'
import { IronFishManager } from '../ironfish/IronFishManager'
import { IronfishAssetManagerActions } from 'Types/IronfishManager/IIronfishAssetManager'
import '../common/index'

import log from 'electron-log'

log.initialize({ preload: true, spyRendererConsole: true })

const ironfishManager = new IronFishManager()
log.transports.file.resolvePathFn = () => path.join(__dirname, 'logs/main.log')
log.log('Application started.')

async function shutdownNode() {
  return await ironfishManager.stop()
}

initStorageCallbacks(ipcMain)

ipcMain.handle(
  'ironfish-manager',
  (e, action: IronfishManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = ironfishManager[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-assets',
  (e, action: IronfishAssetManagerActions, ...args): Promise<any> => {
    let result
    try {
      result = ironfishManager.assets[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-accounts',
  (e, action: IronfishAccountManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = ironfishManager.accounts[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-transactions',
  (e, action: IronfishTransactionManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = ironfishManager.transactions[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-snapshot',
  (e, action: IronfishSnaphotManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = ironfishManager.snapshot[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

process.on('exit', shutdownNode)
process.on('SIGINT', shutdownNode)
process.on('SIGUSR1', shutdownNode)
process.on('SIGUSR2', shutdownNode)

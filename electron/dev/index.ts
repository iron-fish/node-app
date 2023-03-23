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
import '../common/index'
import { IronfishAssetManagerActions } from 'Types/IronfishManager/IIronfishAssetManager'
import log from 'electron-log'

const ironfishManager = new IronFishManager()
log.log('Application started.')

async function shutdownNode() {
  return await ironfishManager.stop()
}

initStorageCallbacks(ipcMain)

ipcMain.handle(
  'ironfish-manager',
  async (e, action: IronfishManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = await ironfishManager[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-assets',
  async (e, action: IronfishAssetManagerActions, ...args): Promise<any> => {
    let result
    try {
      result = await ironfishManager.assets[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-accounts',
  async (e, action: IronfishAccountManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = await ironfishManager.accounts[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-transactions',
  async (
    e,
    action: IronfishTransactionManagerAction,
    ...args
  ): Promise<any> => {
    let result
    try {
      result = await ironfishManager.transactions[action](...args)
    } catch (error) {
      // eslint-disable-next-line no-console
      log.error(error)
    }

    return result
  }
)

ipcMain.handle(
  'ironfish-manager-snapshot',
  async (e, action: IronfishSnaphotManagerAction, ...args): Promise<any> => {
    let result
    try {
      result = await ironfishManager.snapshot[action](...args)
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

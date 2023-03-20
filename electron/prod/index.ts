/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { ipcMain } from 'electron'
import { IronfishManagerAction } from 'Types/IronfishManager/IIronfishManager'
import { IronfishAccountManagerAction } from 'Types/IronfishManager/IIronfishAccountManager'
import { IronfishTransactionManagerAction } from 'Types/IronfishManager/IIronfishTransactionManager'
import { IronfishSnaphotManagerAction } from 'Types/IronfishManager/IIronfishSnapshotManager'
import initStorageCallbacks from '../common/initStorage'
import { IronFishManager } from '../ironfish/IronFishManager'

const ironfishManager = new IronFishManager()

async function shutdownNode() {
  return await ironfishManager.stop()
}

initStorageCallbacks(ipcMain)

ipcMain.handle(
  'ironfish-manager',
  (e, action: IronfishManagerAction, ...args): Promise<any> =>
    ironfishManager[action](...args)
)

ipcMain.handle(
  'ironfish-manager-assets',
  (e, action: IronfishAssetManagerActions, ...args): Promise<any> =>
    ironfishManager.assets[action](...args)
)

ipcMain.handle(
  'ironfish-manager-accounts',
  (e, action: IronfishAccountManagerAction, ...args): Promise<any> =>
    ironfishManager.accounts[action](...args)
)

ipcMain.handle(
  'ironfish-manager-transactions',
  (e, action: IronfishTransactionManagerAction, ...args): Promise<any> =>
    ironfishManager.transactions[action](...args)
)

ipcMain.handle(
  'ironfish-manager-snapshot',
  (e, action: IronfishSnaphotManagerAction, ...args): Promise<any> =>
    ironfishManager.snapshot[action](...args)
)

process.on('exit', shutdownNode)
process.on('SIGINT', shutdownNode)
process.on('SIGUSR1', shutdownNode)
process.on('SIGUSR2', shutdownNode)

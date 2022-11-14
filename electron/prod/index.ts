/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { ipcMain } from 'electron'
import {
  IronfishAccountManagerAction,
  IronfishManagerAction,
  IronfishTransactionManagerAction,
} from 'Types/IIronfishManager'
import initStorageCallbacks from '../common/initStorage'
import { IronFishManager } from '../ironfish/IronFishManager'
import '../common/index'

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
  'ironfish-manager-accounts',
  (e, action: IronfishAccountManagerAction, ...args): Promise<any> =>
    ironfishManager.accounts[action](...args)
)

ipcMain.handle(
  'ironfish-manager-transactions',
  (e, action: IronfishTransactionManagerAction, ...args): Promise<any> =>
    ironfishManager.transactions[action](...args)
)

process.on('exit', shutdownNode)
process.on('SIGINT', shutdownNode)
process.on('SIGUSR1', shutdownNode)
process.on('SIGUSR2', shutdownNode)

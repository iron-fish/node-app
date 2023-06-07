import { ConfigOptions, InternalOptions } from '@ironfish/sdk'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import { IIronfishManager } from 'Types/IronfishManager/IIronfishManager'
import Peer from 'Types/Peer'
import DemoAccountsManager from './DemoAccountsManager'
import DemoNodeManager from './DemoNodeManager'
import DemoTransactionsManager from './DemoTransactionsManager'
import NodeStatusResponse from 'Types/NodeStatusResponse'
import DemoSnapshotManager from './DemoSnapshotManager'
import DemoAssetManager from './DemoAssetManager'
import DemoNodeSettingsManager from './DemoNodeSettingsManager'
import { IIronfishAccountManager } from 'Types/IronfishManager/IIronfishAccountManager'
import IIronfishAssetManager from 'Types/IronfishManager/IIronfishAssetManager'
import { IIronfishTransactionManager } from 'Types/IronfishManager/IIronfishTransactionManager'
import { IIronfishSnapshotManager } from 'Types/IronfishManager/IIronfishSnapshotManager'
import { INodeSettingsManager } from 'Types/IronfishManager/INodeSettingsManager'
import EventType from 'Types/EventType'
import { app } from 'electron'

class DemoDataManager implements IIronfishManager {
  private internalConfig = { isFirstRun: true }
  protected initStatus: IronFishInitStatus = IronFishInitStatus.NOT_STARTED
  accounts: IIronfishAccountManager
  assets: IIronfishAssetManager
  node: DemoNodeManager
  nodeSettings: INodeSettingsManager
  snapshot: IIronfishSnapshotManager
  transactions: IIronfishTransactionManager

  constructor() {
    this.accounts = new DemoAccountsManager()
    this.assets = new DemoAssetManager()
    this.node = new DemoNodeManager()
    this.nodeSettings = new DemoNodeSettingsManager()
    this.snapshot = new DemoSnapshotManager()
    this.transactions = new DemoTransactionsManager()
  }

  private onInitStatusChange(initStatus: IronFishInitStatus) {
    if (this.initStatus !== initStatus) {
      this.initStatus = initStatus
      const event = new CustomEvent(EventType.INIT_STATUS_CHANGE, {
        detail: this.initStatus,
      })
      document.dispatchEvent(event)
    }
  }

  async chainProgress(): Promise<number> {
    return this.node.chainProgress()
  }

  async downloadChainSnapshot(path?: string): Promise<void> {
    await new Promise(resolve =>
      setTimeout(async () => {
        this.onInitStatusChange(IronFishInitStatus.DOWNLOAD_SNAPSHOT)
        this.snapshot.start(path)
        resolve(undefined)
      }, 2000)
    )
  }

  async dump(_errors: Error[]): Promise<string> {
    return ''
  }

  async getNodeConfig(): Promise<Partial<ConfigOptions>> {
    return this.nodeSettings.getConfig()
  }

  async getInternalConfig<T extends keyof InternalOptions>(
    option: T
  ): Promise<InternalOptions[T]> {
    return true as any
  }

  async hasAnyAccount(): Promise<boolean> {
    const accounts = await this.accounts.list()
    return Promise.resolve(accounts.length > 0)
  }

  async initialize(): Promise<void> {
    if (this.initStatus === IronFishInitStatus.DOWNLOAD_SNAPSHOT) {
      this.node.complete()
    }
    this.onInitStatusChange(IronFishInitStatus.INITIALIZING_SDK)
    await new Promise(resolve =>
      setTimeout(() => {
        this.onInitStatusChange(IronFishInitStatus.INITIALIZING_NODE)
        resolve(undefined)
      }, 2000)
    )
    await new Promise(resolve =>
      setTimeout(() => {
        this.onInitStatusChange(IronFishInitStatus.INITIALIZED)
        resolve(undefined)
      }, 2000)
    )
  }

  async isFirstRun(): Promise<boolean> {
    const isFirstRun = this.internalConfig.isFirstRun
    if (isFirstRun) {
      this.internalConfig.isFirstRun = false
    }
    return isFirstRun
  }

  nodeStatus(): Promise<NodeStatusResponse> {
    return this.node.status()
  }

  peers(): Promise<Peer[]> {
    return this.node.peers()
  }

  async saveNodeConfig(values: Partial<ConfigOptions>): Promise<void> {
    this.nodeSettings.setValues(values)
    await this.nodeSettings.save()
    await this.stop()
    await this.initialize()
    return this.start()
  }

  async start(): Promise<void> {
    this.onInitStatusChange(IronFishInitStatus.STARTING_NODE)
    await new Promise(resolve =>
      setTimeout(async () => {
        this.onInitStatusChange(IronFishInitStatus.STARTED)
        await this.node.sync()
        resolve(undefined)
      }, 2000)
    )
  }

  status(): Promise<IronFishInitStatus> {
    return Promise.resolve(this.initStatus)
  }

  async stop(): Promise<void> {
    await new Promise(resolve =>
      setTimeout(() => {
        this.onInitStatusChange(IronFishInitStatus.NOT_STARTED)
        resolve(undefined)
      }, 2000)
    )
  }

  async stopSyncing(): Promise<void> {
    return this.node.stopSyncing()
  }

  async sync(): Promise<void> {
    return this.node.sync()
  }

  async resetNode(): Promise<void> {
    return
  }

  async restartApp(): Promise<void> {
    return
  }
}

export default DemoDataManager

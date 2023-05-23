import { BoxKeyPair } from '@ironfish/rust-nodejs'
import { v4 as uuid } from 'uuid'
import {
  IronfishNode,
  IronfishSdk,
  NodeUtils,
  PrivateIdentity,
  MathUtils,
  Connection,
  ConfigOptions,
  getPackageFrom,
  DatabaseVersionError,
} from '@ironfish/sdk'
import geoip from 'geoip-lite'
import log from 'electron-log'
import fsAsync from 'fs/promises'
import dns from 'dns/promises'
import { BrowserWindow } from 'electron'
import { IIronfishManager } from 'Types/IronfishManager/IIronfishManager'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'
// eslint-disable-next-line no-restricted-imports
import pkg from '../../package.json'
import AccountManager from './AccountManager'
import TransactionManager from './TransactionManager'
import AssetManager from './AssetManager'
import NodeSettingsManager from './NodeSettingsManager'
import Peer from 'Types/Peer'
import SnapshotManager from './SnapshotManager'
import { createAppLogger } from '../utils/AppLogger'
import EventType from 'Types/EventType'
import { ERROR_MESSAGES } from '../utils/constants'

export class IronFishManager implements IIronfishManager {
  protected initStatus: IronFishInitStatus = IronFishInitStatus.NOT_STARTED
  protected sdk: IronfishSdk
  protected node: IronfishNode
  accounts: AccountManager
  assets: AssetManager
  nodeSettings: NodeSettingsManager
  snapshot: SnapshotManager
  transactions: TransactionManager

  private changeInitStatus(initStatus: IronFishInitStatus) {
    if (this.initStatus !== initStatus) {
      this.initStatus = initStatus
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send(EventType.INIT_STATUS_CHANGE, initStatus)
      })
    }
  }

  private initEventListeners() {
    this.node.peerNetwork.peerManager.onConnectedPeersChanged.on(() => {
      BrowserWindow.getAllWindows().forEach(async window => {
        window.webContents.send(EventType.PEERS_CHANGE, await this.getPeers())
      })
    })

    this.accounts.initEventListeners()
    this.assets.initEventListeners()
    this.nodeSettings.initEventListeners()
    this.snapshot.initEventListeners()
    this.transactions.initEventListeners()
  }

  private async getPeers(): Promise<Peer[]> {
    const result: Peer[] = []

    for (const peer of this.node.peerNetwork.peerManager.peers) {
      if (peer.state.type !== 'CONNECTED') {
        continue
      }
      let connections = 0
      let connectionWebRTC: Connection['state']['type'] | '' = ''
      let connectionWebSocket: Connection['state']['type'] | '' = ''
      let connectionWebRTCError = ''
      let connectionWebSocketError = ''

      if (peer.state.connections.webSocket) {
        connectionWebSocket = peer.state.connections.webSocket.state.type
        connectionWebSocketError = String(
          peer.state.connections.webSocket.error || ''
        )
      }

      if (peer.state.connections.webRtc) {
        connectionWebRTC = peer.state.connections.webRtc.state.type
        connectionWebRTCError = String(
          peer.state.connections.webRtc.error || ''
        )
      }

      if (connectionWebSocket !== '') {
        connections++
      }
      if (connectionWebRTC !== '') {
        connections++
      }

      let address = peer.address
      const ipRegexp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/
      if (address && !ipRegexp.test(address)) {
        address = (await dns.lookup(address)).address
      }

      result.push({
        state: peer.state.type,
        identity: peer.state.identity,
        version: peer.version,
        head: peer.head?.toString('hex') || null,
        sequence: peer.sequence !== null ? Number(peer.sequence) : null,
        work: String(peer.work),
        agent: peer.agent,
        name: peer.name,
        address: peer.address,
        country: geoip.lookup(address)?.country,
        port: peer.port,
        error: peer.error !== null ? String(peer.error) : null,
        connections: connections,
        connectionWebSocket: connectionWebSocket,
        connectionWebSocketError: connectionWebSocketError,
        connectionWebRTC: connectionWebRTC,
        connectionWebRTCError: connectionWebRTCError,
        networkId: peer.networkId,
        genesisBlockHash: peer.genesisBlockHash?.toString('hex') || null,
      })
    }

    return result
  }

  private async checkForMigrations(): Promise<void> {
    this.changeInitStatus(IronFishInitStatus.CHECKING_FOR_MIGRATIONS)
    try {
      await this.node.openDB()
      await this.node.closeDB()
    } catch (error) {
      if (error instanceof DatabaseVersionError) {
        this.sdk.config.setOverride('databaseMigrate', true)
      }
    }
  }

  private async resetChain(): Promise<void> {
    const chainDatabasePath = this.sdk.config.chainDatabasePath
    await fsAsync.rm(chainDatabasePath, { recursive: true, force: true })
    this.sdk.internal.set('isFirstRun', true)
    await this.sdk.internal.save()

    const walletDb = this.node.wallet.walletDb
    await walletDb.db.open()

    for (const store of walletDb.cacheStores) {
      await store.clear()
    }
    await walletDb.db.close()
  }

  private async initializeSdk(): Promise<void> {
    //Initializing Iron Fish SDK
    this.changeInitStatus(IronFishInitStatus.INITIALIZING_SDK)
    this.sdk = await IronfishSdk.init({
      pkg: getPackageFrom(pkg),
      logger: createAppLogger(),
      dataDir: process.env.IRONFISH_DATA_DIR || undefined,
    })

    if (!this.sdk.internal.get('telemetryNodeId')) {
      this.sdk.internal.set('telemetryNodeId', uuid())
      await this.sdk.internal.save()
    }
  }

  private async initializeNode(): Promise<void> {
    //Initializing Iron Fish node
    this.changeInitStatus(IronFishInitStatus.INITIALIZING_NODE)
    const privateIdentity = this.getPrivateIdentity()
    this.node = await this.sdk.node({
      privateIdentity: privateIdentity,
      autoSeed: true,
    })

    await this.checkForMigrations()

    try {
      await NodeUtils.waitForOpen(this.node)
    } catch (error) {
      if (error.message.includes(ERROR_MESSAGES.GENESIS_BLOCK)) {
        log.log(ERROR_MESSAGES.GENESIS_BLOCK)
        log.log('----------- resetting chain ----------------')
        await this.resetChain()
        await NodeUtils.waitForOpen(this.node)
      } else {
        this.changeInitStatus(IronFishInitStatus.ERROR)
      }
    }

    const newSecretKey = Buffer.from(
      this.node.peerNetwork.localPeer.privateIdentity.secretKey
    ).toString('hex')
    this.node.internal.set('networkIdentity', newSecretKey)
    await this.node.internal.save()

    this.assets = new AssetManager(this.node)
    this.accounts = new AccountManager(this.node, this.assets)
    this.transactions = new TransactionManager(this.node, this.assets)
    this.nodeSettings = new NodeSettingsManager(this.node)
    this.snapshot = new SnapshotManager(this.node)

    this.changeInitStatus(IronFishInitStatus.INITIALIZED)
    this.initEventListeners()
  }

  private getPrivateIdentity(): PrivateIdentity | undefined {
    const networkIdentity = this.sdk.internal.get('networkIdentity')
    if (
      !this.sdk.config.get('generateNewIdentity') &&
      networkIdentity !== undefined &&
      networkIdentity.length > 31
    ) {
      return BoxKeyPair.fromHex(networkIdentity)
    }
  }

  chainProgress(): Promise<number> {
    return Promise.resolve(this.node.chain.getProgress())
  }

  async downloadChainSnapshot(path?: string): Promise<void> {
    if (
      this.initStatus < IronFishInitStatus.INITIALIZED ||
      this.initStatus === IronFishInitStatus.ERROR
    ) {
      return Promise.reject(new Error('Node is not initialized.'))
    }
    this.changeInitStatus(IronFishInitStatus.DOWNLOAD_SNAPSHOT)
    return this.snapshot.start(path)
  }

  getNodeConfig(): Promise<Partial<ConfigOptions>> {
    return Promise.resolve(this.nodeSettings.getConfig())
  }

  async hasAnyAccount(): Promise<boolean> {
    return Promise.resolve(this.node.wallet.listAccounts().length > 0)
  }

  async initialize(): Promise<void> {
    try {
      await this.initializeSdk()
      await this.initializeNode()
    } catch (e) {
      this.changeInitStatus(IronFishInitStatus.ERROR)
      log.error(e)
    }
  }

  async nodeStatus(): Promise<NodeStatusResponse> {
    if (
      this.initStatus < IronFishInitStatus.STARTED ||
      this.initStatus === IronFishInitStatus.ERROR
    ) {
      return Promise.resolve(null)
    }
    let totalSequences = 0
    const peers = this.node.peerNetwork.peerManager
      .getConnectedPeers()
      .filter(peer => peer.work && peer.work > this.node.chain.head.work)

    if (peers.length > 0) {
      totalSequences = peers[0].sequence
    }
    const client = await this.sdk.connectRpc()
    const accounts = (await client.wallet.getAccountsStatus({})).content
      .accounts

    const status = {
      node: {
        status: this.node.started
          ? NodeStatusType.STARTED
          : NodeStatusType.STOPPED,
        nodeName: this.node.config.get('nodeName'),
      },
      cpu: {
        cores: this.node.metrics.cpuCores,
        percentRollingAvg: this.node.metrics.cpuMeter.rollingAverage,
        percentCurrent: this.node.metrics.cpuMeter.current,
      },
      memory: {
        heapMax: this.node.metrics.heapMax,
        heapTotal: this.node.metrics.heapTotal.value,
        heapUsed: this.node.metrics.heapUsed.value,
        rss: this.node.metrics.rss.value,
        memFree: this.node.metrics.memFree.value,
        memTotal: this.node.metrics.memTotal,
      },
      peerNetwork: {
        peers: this.node.metrics.p2p_PeersCount.value,
        isReady: this.node.peerNetwork.isReady,
        inboundTraffic: Math.max(
          this.node.metrics.p2p_InboundTraffic.rate1s,
          0
        ),
        outboundTraffic: Math.max(
          this.node.metrics.p2p_OutboundTraffic.rate1s,
          0
        ),
      },
      blockSyncer: {
        status: this.node.syncer.state,
        syncing: {
          blockSpeed: MathUtils.round(this.node.chain.addSpeed.average, 2),
          speed: MathUtils.round(this.node.syncer.speed.rollingRate1m, 2),
          downloadSpeed: MathUtils.round(
            this.node.syncer.downloadSpeed.average,
            2
          ),
          progress: this.node.chain.getProgress(),
        },
      },
      blockchain: {
        synced: this.node.chain.synced,
        head: this.node.chain.head.sequence.toString(),
        totalSequences: totalSequences.toString(),
        headTimestamp: this.node.chain.head.timestamp.getTime(),
        newBlockSpeed: this.node.metrics.chain_newBlock.avg,
      },
      accounts: accounts,
    }
    return Promise.resolve(status)
  }

  peers(): Promise<Peer[]> {
    return Promise.resolve(this.getPeers())
  }

  async saveNodeConfig(values: Partial<ConfigOptions>): Promise<void> {
    this.nodeSettings.setValues(values)
    await this.nodeSettings.save()
    await this.stop()
  }

  async start(): Promise<void> {
    if (
      this.initStatus !== IronFishInitStatus.INITIALIZED &&
      this.initStatus !== IronFishInitStatus.DOWNLOAD_SNAPSHOT
    ) {
      throw new Error(
        'SDK and node is not initialized. Please call init method first.'
      )
    }

    this.changeInitStatus(IronFishInitStatus.STARTING_NODE)
    if (!this.node.wallet.getDefaultAccount()) {
      const accounts = this.node.wallet.listAccounts()
      if (accounts.length > 0) {
        await this.node.wallet.setDefaultAccount(accounts[0].name)
      } else {
        throw new Error(
          'There no accounts in wallet. Please create or import account first.'
        )
      }
    }

    //Starting node
    await this.node.start()
    this.changeInitStatus(IronFishInitStatus.STARTED)
  }

  status(): Promise<IronFishInitStatus> {
    return Promise.resolve(this.initStatus)
  }

  async stop(changeStatus = true): Promise<void> {
    await this.node?.shutdown()
    await this.node?.closeDB()
    await this.node.waitForShutdown()

    if (changeStatus) {
      this.changeInitStatus(IronFishInitStatus.NOT_STARTED)
    }
  }

  async stopSyncing(): Promise<void> {
    await this.node.syncer.peerNetwork.stop()
  }

  async sync(): Promise<void> {
    await this.node.syncer.peerNetwork.start()
  }
}

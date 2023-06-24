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
  InternalOptions,
  HOST_FILE_NAME,
  DatabaseIsLockedError,
} from '@ironfish/sdk'
import log from 'electron-log'
import fsAsync from 'fs/promises'
import dns from 'dns/promises'
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
import sendMessageToRender from '../utils/sendMessageToRender'
import { WorkerMessageType } from '@ironfish/sdk/build/src/workerPool/tasks/workerMessage'
import { app, shell } from 'electron'

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
      sendMessageToRender(EventType.INIT_STATUS_CHANGE, initStatus)
    }
  }

  private initEventListeners() {
    this.node.peerNetwork.peerManager.onConnectedPeersChanged.on(async () => {
      sendMessageToRender(EventType.PEERS_CHANGE, await this.getPeers())
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
        country: null,
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
      } else {
        log.error(error)
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

  // used to reset node if datadir exists but is incompatible with mainnet
  async resetNode(): Promise<void> {
    log.log('Resetting node')
    await this.node.shutdown()
    await this.node.closeDB()
    const hostFilePath: string = this.sdk.config.files.join(
      this.sdk.config.dataDir,
      HOST_FILE_NAME
    )
    await fsAsync.rm(hostFilePath, { recursive: true, force: true })
    // Reset walletDb stores containing chain data
    await this.resetChain()

    // Reset the telemetry config to allow people to re-opt in
    if (
      this.sdk.config.isSet('enableTelemetry') &&
      this.sdk.config.get('enableTelemetry')
    ) {
      this.sdk.config.clear('enableTelemetry')
      await this.sdk.config.save()
    }
    if (this.node.config.isSet('networkId')) {
      this.node.config.clear('networkId')
      await this.node.config.save()
    }

    this.sdk.internal.set('networkId', 1)
    this.sdk.internal.set('isFirstRun', true)
    this.sdk.internal.set('telemetryNodeId', `node-app-${uuid()}`)
    await this.sdk.internal.save()

    this.sdk.config.setOverride('databaseMigrate', true)

    this.node = await this.sdk.node({
      privateIdentity: this.getPrivateIdentity(),
      autoSeed: true,
    })
    log.log('Node reset complete')
  }

  async restartApp(): Promise<void> {
    app.relaunch()
    app.exit()
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
      this.sdk.internal.set('telemetryNodeId', `node-app-${uuid()}`)
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

    if (
      (this.sdk.internal.get('networkId') === 0 ||
        this.node.config.get('networkId') === 0) &&
      (app.isPackaged || process.env.ENABLE_RESET)
    ) {
      log.log(
        '----------- resetting chain due to network incompatibility ----------------'
      )
      await this.resetNode()
    }

    try {
      await this.node.openDB()
    } catch (error) {
      if (error instanceof DatabaseIsLockedError) {
        log.error(error)
        this.changeInitStatus(IronFishInitStatus.ERROR)
        throw new Error(
          'Another node is using the database. Please close that node and restart.'
        )
      } else if (error.message.includes(ERROR_MESSAGES.GENESIS_BLOCK)) {
        log.log(ERROR_MESSAGES.GENESIS_BLOCK)
        log.log('----------- resetting chain ----------------')
        await this.resetChain()
        await NodeUtils.waitForOpen(this.node)
      } else {
        log.error(error)
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

  async getInternalConfig<T extends keyof InternalOptions>(
    option: T
  ): Promise<InternalOptions[T]> {
    return this.sdk.internal.get(option)
  }

  async initialize(): Promise<void> {
    try {
      await this.initializeSdk()
      await this.initializeNode()
    } catch (e) {
      log.error(e)
      this.changeInitStatus(IronFishInitStatus.ERROR)
      throw e
    }
  }

  async isFirstRun(): Promise<boolean> {
    const isFirstRun = this.sdk.internal.get('isFirstRun')
    if (isFirstRun) {
      this.sdk.internal.set('isFirstRun', false)
      this.sdk.internal.save()
    }
    return isFirstRun
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
    const headHashes = new Map<string, Buffer | null>()
    // sometimes walletdb isn't open
    try {
      for await (const {
        accountId,
        head,
      } of this.node.wallet.walletDb.loadHeads()) {
        headHashes.set(accountId, head?.hash ?? null)
      }
    } catch (e) {}

    const accountsInfo = []
    for (const account of this.node.wallet.listAccounts()) {
      const headHash = headHashes.get(account.id)
      const blockHeader = headHash
        ? await this.node.chain.getHeader(headHash)
        : null
      const headInChain = !!blockHeader
      const headSequence = blockHeader?.sequence || 'NULL'
      accountsInfo.push({
        name: account.name,
        id: account.id,
        headHash: headHash ? headHash.toString('hex') : 'NULL',
        headInChain: headInChain,
        sequence: headSequence,
      })
    }

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
      accounts: accountsInfo,
    }
    return Promise.resolve(status)
  }

  async openLink(url: string): Promise<void> {
    return Promise.resolve(shell.openExternal(url))
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

  async dump(errors: Error[]): Promise<string> {
    let logDump = `=====================================================
=========== Iron Fish Node App Crash Dump ===========
=====================================================
`

    if (errors.length) {
      logDump += `
Errors
-----------------------------------------------------
`
      for (const error of errors) {
        if (error.stack) {
          logDump += `* ${error.stack}\n`
        } else {
          logDump += `* ${error.message}\n`
        }
      }
    }

    if (this.node) {
      const nodeStatus = await this.nodeStatus()
      const config = await this.getNodeConfig()

      let jobs = ''
      for (const type of this.node.workerPool.stats.keys()) {
        if (
          type === WorkerMessageType.JobAborted ||
          type === WorkerMessageType.Sleep
        ) {
          continue
        }

        const job = this.node.workerPool.stats.get(type)

        if (job) {
          const name = WorkerMessageType[type]
          jobs += `${name.padEnd(20)}(complete=${job.complete},error=${
            job.error
          },execute=${job.execute},queued=${job.queue})\n`
        }
      }

      logDump += `
Node
-----------------------------------------------------
Status:             ${nodeStatus?.node.status}

CPU
-----------------------------------------------------
Cores:              ${nodeStatus?.cpu.cores}
Current:            ${nodeStatus?.cpu.percentCurrent.toFixed(1)}%
Rolling Avg:        ${nodeStatus?.cpu.percentRollingAvg.toFixed(1)}%

Mempool
-----------------------------------------------------
Transactions:       ${this.node.memPool.count()}
Size (bytes):       ${this.node.memPool.sizeBytes()}
Max Size (bytes):   ${this.node.memPool.maxSizeBytes}
Head Sequence:      ${this.node.memPool.head?.sequence || 0}
Evictions:          ${this.node.metrics.memPoolEvictions.value}
Recently Evicted:   ${this.node.memPool.recentlyEvictedCacheStats().size}

Peer Network
-----------------------------------------------------
Peers:              ${nodeStatus?.peerNetwork.peers}
Ready:              ${nodeStatus?.peerNetwork.isReady}
Inbound Traffic:    ${nodeStatus?.peerNetwork.inboundTraffic.toFixed(1)}
Outbound Traffic:   ${nodeStatus?.peerNetwork.outboundTraffic.toFixed(1)}

Workers
-----------------------------------------------------
Started:            ${this.node.workerPool.started}
Workers:            ${this.node.workerPool.workers.length}
Executing:          ${this.node.workerPool.executing}
Queued:             ${this.node.workerPool.queued}
Capacity:           ${this.node.workerPool.capacity}
Change:             ${MathUtils.round(
        this.node.workerPool.change?.rate5s ?? 0,
        2
      )}
Speed:              ${MathUtils.round(
        this.node.workerPool.speed?.rate5s ?? 0,
        2
      )}

Jobs
-----------------------------------------------------
${jobs}
Config
-----------------------------------------------------
${JSON.stringify(config, null, 2)}
`
    } else {
      logDump += 'Node was not initialized\n'
    }

    logDump += '============ Iron Fish Node App Dump End ============'

    for (const line of logDump.split('\n')) {
      log.error(line)
    }

    return logDump
  }
}

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
import { IIronfishManager } from 'Types/IronfishManager/IIronfishManager'
import { INodeSettingsManager } from 'Types/IronfishManager/INodeSettingsManager'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'
// eslint-disable-next-line no-restricted-imports
import pkg from '../../package.json'
import AccountManager from './AccountManager'
import TransactionManager from './TransactionManager'
import AssetManager from './AssetManager'
import NodeSettingsManager from './NodeSettingsManager'
import Peer from 'Types/Peer'
import { IIronfishSnapshotManager } from 'Types/IronfishManager/IIronfishSnapshotManager'
import SnapshotManager from './SnapshotManager'

export class IronFishManager implements IIronfishManager {
  protected initStatus: IronFishInitStatus = IronFishInitStatus.NOT_STARTED
  protected sdk: IronfishSdk
  protected node: IronfishNode
  accounts: AccountManager
  transactions: TransactionManager
  assets: AssetManager
  nodeSettings: INodeSettingsManager
  snapshot: IIronfishSnapshotManager

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

  async checkForMigrations(): Promise<void> {
    this.initStatus = IronFishInitStatus.CHECKING_FOR_MIGRATIONS
    try {
      await this.node.openDB()
      await this.node.closeDB()
    } catch (error) {
      if (error instanceof DatabaseVersionError) {
        this.sdk.config.setOverride('databaseMigrate', true)
      }
    }
  }

  private async initializeSdk(): Promise<void> {
    //Initializing Iron Fish SDK
    this.initStatus = IronFishInitStatus.INITIALIZING_SDK
    this.sdk = await IronfishSdk.init({
      pkg: getPackageFrom(pkg),
    })

    if (!this.sdk.internal.get('telemetryNodeId')) {
      this.sdk.internal.set('telemetryNodeId', uuid())
      await this.sdk.internal.save()
    }
  }

  private async initializeNode(): Promise<void> {
    //Initializing Iron Fish node
    this.initStatus = IronFishInitStatus.INITIALIZING_NODE
    const privateIdentity = this.getPrivateIdentity()
    this.node = await this.sdk.node({
      privateIdentity: privateIdentity,
      autoSeed: true,
    })

    await this.checkForMigrations()

    await NodeUtils.waitForOpen(this.node)

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

    this.initStatus = IronFishInitStatus.INITIALIZED
  }

  async initialize(): Promise<void> {
    try {
      await this.initializeSdk()
      await this.initializeNode()
    } catch (e) {
      this.initStatus = IronFishInitStatus.ERROR
      // eslint-disable-next-line no-console
      console.error(e)
    }
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

    this.initStatus = IronFishInitStatus.STARTING_NODE
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
    this.initStatus = IronFishInitStatus.STARTED
  }

  async stop(changeStatus = true): Promise<void> {
    await this.node?.shutdown()
    await this.node?.closeDB()

    if (changeStatus) {
      this.initStatus = IronFishInitStatus.NOT_STARTED
    }
  }

  async hasAnyAccount(): Promise<boolean> {
    return Promise.resolve(this.node.wallet.listAccounts().length > 0)
  }

  status(): Promise<IronFishInitStatus> {
    return Promise.resolve(this.initStatus)
  }

  chainProgress(): Promise<number> {
    return Promise.resolve(this.node.chain.getProgress())
  }

  nodeStatus(): Promise<NodeStatusResponse> {
    if (
      this.initStatus < IronFishInitStatus.INITIALIZED ||
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
    }
    return Promise.resolve(status)
  }

  async sync(): Promise<void> {
    await this.node.syncer.peerNetwork.start()
  }

  async stopSyncing(): Promise<void> {
    await this.node.syncer.peerNetwork.stop()
  }

  peers(): Promise<Peer[]> {
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
        country: geoip.lookup(peer.address)?.country,
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

    return Promise.resolve(result)
  }

  async downloadChainSnapshot(path?: string): Promise<void> {
    if (
      this.initStatus < IronFishInitStatus.INITIALIZED ||
      this.initStatus === IronFishInitStatus.ERROR
    ) {
      return Promise.reject(new Error('Node is not initialized.'))
    }
    this.initStatus = IronFishInitStatus.DOWNLOAD_SNAPSHOT
    return this.snapshot.start(path)
  }

  getNodeConfig(): Promise<Partial<ConfigOptions>> {
    return Promise.resolve(this.nodeSettings.getConfig())
  }

  async saveNodeConfig(values: Partial<ConfigOptions>): Promise<void> {
    this.nodeSettings.setValues(values)
    await this.nodeSettings.save()
    await this.stop()
    await this.initializeNode()
    return this.start()
  }
}

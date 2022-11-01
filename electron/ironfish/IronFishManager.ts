import { BoxKeyPair } from '@ironfish/rust-nodejs'
import {
  AccountValue,
  IronfishNode,
  IronfishSdk,
  NodeUtils,
  PrivateIdentity,
  MathUtils,
  PeerResponse,
  Connection,
} from '@ironfish/sdk'
import AccountBalance from 'Types/AccountBalance'
import CutAccount from 'Types/CutAccount'
import {
  IIronfishManager,
  IIronfishAccountManager,
} from 'Types/IIronfishManager'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'

class AccountManager implements IIronfishAccountManager {
  private node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }

  async create(name: string): Promise<AccountValue> {
    return this.node.wallet
      .createAccount(name)
      .then(account => account.serialize())
  }

  list(search?: string): Promise<CutAccount[]> {
    return Promise.resolve(
      this.node.wallet
        .listAccounts()
        .filter(
          account =>
            !search ||
            account.name.includes(search) ||
            account.publicAddress.includes(search)
        )
        .map(account => ({
          name: account.name,
          id: account.id,
          publicAddress: account.publicAddress,
        }))
    )
  }

  get(id: string): Promise<AccountValue | null> {
    const account = this.node.wallet.getAccount(id)?.serialize()

    return Promise.resolve(account || null)
  }

  async delete(name: string): Promise<void> {
    await this.node.wallet.removeAccount(name)
  }

  async import(
    account: Omit<AccountValue, 'id' | 'rescan'>
  ): Promise<AccountValue> {
    return this.node.wallet
      .importAccount(account)
      .then(data => data.serialize())
  }

  export(id: string): Promise<AccountValue> {
    return Promise.resolve(this.node.wallet.getAccount(id)?.serialize())
  }

  balance(id: string): Promise<AccountBalance> {
    const account = this.node.wallet.getAccount(id)
    if (account) {
      return this.node.wallet.getBalance(account)
    }

    return Promise.reject(new Error(`Account with id=${id} was not found.`))
  }
}

export class IronFishManager implements IIronfishManager {
  protected initStatus: IronFishInitStatus = IronFishInitStatus.NOT_STARTED
  protected sdk: IronfishSdk
  protected node: IronfishNode
  accounts: IIronfishAccountManager

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

  async initialize(): Promise<void> {
    try {
      //Initializing Iron Fish SDK
      this.initStatus = IronFishInitStatus.INITIALIZING_SDK
      this.sdk = await IronfishSdk.init({
        configOverrides: {
          nodeWorkers: 0,
        },
      })

      //Initializing Iron Fish node
      this.initStatus = IronFishInitStatus.INITIALIZING_NODE
      const privateIdentity = this.getPrivateIdentity()
      this.node = await this.sdk.node({ privateIdentity: privateIdentity })
      await NodeUtils.waitForOpen(this.node)

      this.accounts = new AccountManager(this.node)

      this.initStatus = IronFishInitStatus.INITIALIZED
    } catch (e) {
      this.initStatus = IronFishInitStatus.ERROR
    }
  }

  async start(): Promise<void> {
    if (this.initStatus !== IronFishInitStatus.INITIALIZED) {
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

  async stop(): Promise<void> {
    await this.node?.shutdown()
    await this.node?.closeDB()
    this.initStatus = IronFishInitStatus.NOT_STARTED
  }

  async hasAnyAccount(): Promise<boolean> {
    return Promise.resolve(this.node.wallet.listAccounts().length > 0)
  }

  status(): Promise<IronFishInitStatus> {
    return Promise.resolve(this.initStatus)
  }

  nodeStatus(): Promise<NodeStatusResponse> {
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
          blockSpeed: MathUtils.round(this.node.chain.addSpeed.avg, 2),
          speed: MathUtils.round(this.node.syncer.speed.rate1m, 2),
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

  peers(): Promise<PeerResponse[]> {
    const result: PeerResponse[] = []

    for (const peer of this.node.peerNetwork.peerManager.peers) {
      let connections = 0
      let connectionWebRTC: Connection['state']['type'] | '' = ''
      let connectionWebSocket: Connection['state']['type'] | '' = ''
      let connectionWebRTCError = ''
      let connectionWebSocketError = ''

      if (peer.state.type !== 'DISCONNECTED') {
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
      }

      if (connectionWebSocket !== '') {
        connections++
      }
      if (connectionWebRTC !== '') {
        connections++
      }

      result.push({
        state: peer.state.type,
        address: peer.address,
        port: peer.port,
        identity: peer.state.identity,
        name: peer.name,
        version: peer.version,
        agent: peer.agent,
        head: peer.head?.toString('hex') || null,
        work: String(peer.work),
        sequence: peer.sequence !== null ? Number(peer.sequence) : null,
        connections: connections,
        error: peer.error !== null ? String(peer.error) : null,
        connectionWebSocket: connectionWebSocket,
        connectionWebSocketError: connectionWebSocketError,
        connectionWebRTC: connectionWebRTC,
        connectionWebRTCError: connectionWebRTCError,
      })
    }

    return Promise.resolve(result)
  }
}

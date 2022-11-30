import { BoxKeyPair } from '@ironfish/rust-nodejs'
import {
  AccountValue,
  IronfishNode,
  IronfishSdk,
  NodeUtils,
  PrivateIdentity,
  CurrencyUtils,
  Account,
  MathUtils,
  PeerResponse,
  Connection,
} from '@ironfish/sdk'
import { TransactionValue } from '@ironfish/sdk/build/src/wallet/walletdb/transactionValue'
import AccountBalance from 'Types/AccountBalance'
import CutAccount from 'Types/CutAccount'
import {
  IIronfishManager,
  IIronfishAccountManager,
  TransactionFeeStatistic,
  IIronfishTransactionManager,
} from 'Types/IIronfishManager'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import WalletAccount from 'Types/Account'
import SortType from 'Types/SortType'
import Transaction, { Payment } from 'Types/Transaction'
import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'

class AccountManager implements IIronfishAccountManager {
  private node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }

  async create(name: string): Promise<WalletAccount> {
    return this.node.wallet
      .createAccount(name)
      .then(account => account.serialize())
  }

  async list(searchTerm?: string, sort?: SortType): Promise<CutAccount[]> {
    const search = searchTerm?.toLowerCase()
    const accounts = this.node.wallet.listAccounts()

    const result: CutAccount[] = await Promise.all(
      accounts.map(async account => ({
        id: account.id,
        name: account.name,
        publicAddress: account.publicAddress,
        balance: await this.node.wallet.getBalance(account),
      }))
    )

    if (sort) {
      result.sort(
        (a, b) =>
          (SortType.ASC === sort ? 1 : -1) *
          (Number(a.balance.confirmed) - Number(b.balance.confirmed))
      )
    }

    return result.filter(
      account =>
        !search ||
        account.name.toLowerCase().includes(search) ||
        account.publicAddress.toLowerCase().includes(search) ||
        CurrencyUtils.renderIron(account.balance.confirmed).includes(search)
    )
  }

  async get(id: string): Promise<WalletAccount | null> {
    const account: WalletAccount = this.node.wallet.getAccount(id)?.serialize()
    if (account) {
      account.balance = await this.balance(account.id)
    }

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

class TransactionManager implements IIronfishTransactionManager {
  private node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }

  async pay(
    accountId: string,
    payment: Payment,
    transactionFee?: number
  ): Promise<Transaction> {
    const account = this.node.wallet.getAccount(accountId)
    const headSequence = await this.node.wallet.getAccountHeadSequence(account)
    const fee = transactionFee || (await this.averageFee())
    const transaction = await this.node.wallet.createTransaction(
      account,
      [payment],
      BigInt(fee),
      0
    )

    return await this.resolveTransactionFields(
      account,
      headSequence,
      await account.getTransaction(transaction.hash())
    )
  }

  private async getFees(numOfBlocks = 100) {
    let startBlock
    const endBlock = this.node.chain.latest.sequence
    const fees: number[] = []

    let hash = this.node.chain.latest.hash

    for (let i = 0; i < numOfBlocks; i++) {
      const block = await this.node.chain.getBlock(hash)
      hash = block.header.previousBlockHash

      if (block) {
        startBlock = block.header.sequence
        block.transactions.forEach(transaction => {
          !transaction.isMinersFee() && fees.push(Number(transaction.fee()))
        })
      }
    }

    return {
      startBlock,
      endBlock,
      fees,
    }
  }

  async fees(numOfBlocks = 100): Promise<TransactionFeeStatistic> {
    const { startBlock, endBlock, fees } = await this.getFees(numOfBlocks)

    fees.sort((a, b) => a - b)

    return {
      startBlock,
      endBlock,
      p25: fees[Math.floor(fees.length * 0.25)],
      p50: fees[Math.floor(fees.length * 0.5)],
      p75: fees[Math.floor(fees.length * 0.75)],
      p100: fees[fees.length - 1],
    }
  }

  async averageFee(numOfBlocks = 100): Promise<number> {
    const { fees } = await this.getFees(numOfBlocks)

    return fees.reduce((prev, curr) => prev + curr, 0) / fees.length
  }

  async get(hash: string, accountId: string): Promise<Transaction> {
    const account = this.node.wallet.getAccount(accountId)
    const headSequence = await this.node.wallet.getAccountHeadSequence(account)
    const transaction = await account.getTransactionByUnsignedHash(
      Buffer.from(hash)
    )
    await this.node.wallet.syncTransaction(
      transaction.transaction,
      transaction,
      [account]
    )
    return await this.resolveTransactionFields(
      account,
      headSequence,
      transaction
    )
  }

  private async resolveTransactionFields(
    account: Account,
    headSequence: number,
    transaction: Readonly<TransactionValue>
  ): Promise<Transaction> {
    const status = await this.node.wallet.getTransactionStatus(
      account,
      transaction,
      { headSequence }
    )
    const created = await this.node.chain.getBlock(transaction.blockHash)
    const spends = []
    let creator = false
    for await (const spend of transaction.transaction.spends()) {
      const noteHash = await account.getNoteHash(spend.nullifier)

      if (noteHash) {
        creator = true
        break
      }

      spends.push(spend)
    }
    const notes = await account.getTransactionNotes(transaction.transaction)

    return {
      accountId: account.id,
      hash: transaction.transaction.unsignedHash().toString('hex'),
      isMinersFee: transaction.transaction.isMinersFee(),
      fee: transaction.transaction.fee().toString(),
      notesCount: transaction.transaction.notesLength(),
      spendsCount: transaction.transaction.spendsLength(),
      expirationSequence: transaction.transaction.expirationSequence(),
      status,
      notes: notes.map(n => ({
        value: n.note.value(),
        memo: n.note.memo(),
      })),
      spends,
      creator,
      from: creator ? account.publicAddress : '',
      to: creator ? '' : account.publicAddress,
      created: created?.header?.timestamp,
      amount: CurrencyUtils.renderIron(
        notes
          .map(note => note.note.value())
          .reduce((prev, curr) => prev + curr, BigInt(0))
      ),
    }
  }

  async findByAccountId(
    accountId: string,
    searchTerm?: string,
    sort?: SortType
  ): Promise<Transaction[]> {
    const account = this.node.wallet.getAccount(accountId)
    const headSequence = await this.node.wallet.getAccountHeadSequence(account)
    const transactions = []
    for await (const transaction of account.getTransactions()) {
      transactions.push(
        await this.resolveTransactionFields(account, headSequence, transaction)
      )
    }
    const search = searchTerm?.toLowerCase()

    return transactions
      .filter(
        transaction =>
          !search ||
          transaction.from.toLowerCase().includes(search) ||
          transaction.to.toLowerCase().includes(search) ||
          transaction.notes.find(note =>
            note.memo?.toLowerCase().includes(search)
          ) ||
          transaction.amount.toString().includes(search)
      )
      .sort((t1, t2) => {
        const date1: number = (t1.created || new Date()).getTime()
        const date2: number = (t2.created || new Date()).getTime()

        return sort === SortType.ASC ? date1 - date2 : date2 - date1
      })
  }

  async findByAddress(address: string, searchTerm?: string, sort?: SortType) {
    const transactions: Transaction[] = await Promise.resolve([])

    return transactions
  }
}

export class IronFishManager implements IIronfishManager {
  protected initStatus: IronFishInitStatus = IronFishInitStatus.NOT_STARTED
  protected sdk: IronfishSdk
  protected node: IronfishNode
  accounts: IIronfishAccountManager
  transactions: IIronfishTransactionManager

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
      this.sdk = await IronfishSdk.init()

      //Initializing Iron Fish node
      this.initStatus = IronFishInitStatus.INITIALIZING_NODE
      const privateIdentity = this.getPrivateIdentity()
      this.node = await this.sdk.node({ privateIdentity: privateIdentity })
      await NodeUtils.waitForOpen(this.node)

      this.accounts = new AccountManager(this.node)
      this.transactions = new TransactionManager(this.node)

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
          blockSpeed: MathUtils.round(this.node.syncer.speed.avg, 2),
          speed: MathUtils.round(this.node.syncer.downloadSpeed.average, 2),
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

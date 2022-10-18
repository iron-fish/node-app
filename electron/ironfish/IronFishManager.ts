import { BoxKeyPair } from '@ironfish/rust-nodejs'
import {
  Account,
  AccountValue,
  IronfishNode,
  IronfishSdk,
  NodeUtils,
  PrivateIdentity,
} from '@ironfish/sdk'
import {
  IIronfishManager,
  IIronfishAccountManager,
} from 'Types/IIronfishManager'
import IronFishInitStatus from 'Types/IronfishInitStatus'

class AccountManager implements IIronfishAccountManager {
  private node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }

  async create(name: string): Promise<AccountValue> {
    return this.node.wallet.createAccount(name).then(account => ({
      id: account.id,
      name: account.name,
      publicAddress: account.publicAddress,
      incomingViewKey: account.incomingViewKey,
      outgoingViewKey: account.outgoingViewKey,
      spendingKey: account.spendingKey,
    }))
  }

  list(): Promise<Pick<Account, 'id' | 'name' | 'publicAddress'>[]> {
    return Promise.resolve(
      this.node.wallet.listAccounts().map(account => ({
        name: account.name,
        id: account.id,
        publicAddress: account.publicAddress,
      }))
    )
  }

  get(id: string): Promise<AccountValue | null> {
    const account = this.node.wallet.getAccount(id)
    let result = null
    if (account) {
      result = {
        id: account.id,
        name: account.name,
        publicAddress: account.publicAddress,
        incomingViewKey: account.incomingViewKey,
        outgoingViewKey: account.outgoingViewKey,
        spendingKey: account.spendingKey,
      }
    }
    return Promise.resolve(result)
  }

  async delete(name: string): Promise<void> {
    await this.node.wallet.removeAccount(name)
  }

  async import(account: Omit<AccountValue, 'id' | 'rescan'>): Promise<Account> {
    return this.node.wallet.importAccount(account)
  }

  export(id: string): Promise<AccountValue> {
    return Promise.resolve(this.node.wallet.getAccount(id)?.serialize())
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
      this.sdk = await IronfishSdk.init()

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
}

import {
  IronfishSdk,
  RpcClient,
  IronfishNode,
  PrivateIdentity,
  NodeUtils,
} from '@ironfish/sdk'
import { BoxKeyPair } from '@ironfish/rust-nodejs'
import IronFishInitStatus from 'Types/IronfishInitStatus'

const DEFAULT_ACCOUNT_NAME = 'default'

export class IronFishManager {
  protected initStatus: IronFishInitStatus = IronFishInitStatus.NOT_STARTED
  protected sdk: IronfishSdk
  protected node: IronfishNode

  async start(): Promise<void> {
    try {
      //Initializing Iron Fish SDK
      this.initStatus = IronFishInitStatus.INITIALIZING_SDK
      this.sdk = await IronfishSdk.init()

      //Initializing Iron Fish node
      this.initStatus = IronFishInitStatus.INITIALIZING_NODE
      const privateIdentity = this.getPrivateIdentity()
      this.node = await this.sdk.node({ privateIdentity: privateIdentity })
      await NodeUtils.waitForOpen(this.node)

      //Create default account if needed
      if (!this.node.wallet.getDefaultAccount()) {
        if (!this.node.wallet.accountExists(DEFAULT_ACCOUNT_NAME)) {
          await this.node.wallet.createAccount(DEFAULT_ACCOUNT_NAME, true)
        } else {
          await this.node.wallet.setDefaultAccount(DEFAULT_ACCOUNT_NAME)
        }
      }
      //Starting node
      this.initStatus = IronFishInitStatus.STARTING_NODE
      await this.node.start()

      this.initStatus = IronFishInitStatus.READY
    } catch (e) {
      this.initStatus = IronFishInitStatus.ERROR
    }
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

  getInitStatus(): IronFishInitStatus {
    return this.initStatus
  }

  async stop(): Promise<void> {
    await this.node?.shutdown()
    await this.node?.closeDB()
    this.initStatus = IronFishInitStatus.NOT_STARTED
  }
}

import { AccountValue, CurrencyUtils, IronfishNode } from '@ironfish/sdk'
import { IIronfishAccountManager } from 'Types/IronfishManager/IIronfishAccountManager'
import { Asset as NativeAsset } from '@ironfish/rust-nodejs'
import WalletAccount from 'Types/Account'
import SortType from 'Types/SortType'
import CutAccount from 'Types/CutAccount'
import AccountBalance from 'Types/AccountBalance'
import AbstractManager from './AbstractManager'
import AssetManager from './AssetManager'
import Asset from 'Types/Asset'

class AccountManager
  extends AbstractManager
  implements IIronfishAccountManager
{
  private assetManager: AssetManager

  constructor(node: IronfishNode, assetManager: AssetManager) {
    super(node)
    this.assetManager = assetManager
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
        balances: await this.balances(account.id),
      }))
    )

    if (sort) {
      result.sort(
        (a, b) =>
          (SortType.ASC === sort ? 1 : -1) *
          (Number(a.balances.default.confirmed) -
            Number(b.balances.default.confirmed))
      )
    }

    return result.filter(
      account =>
        !search ||
        account.name.toLowerCase().includes(search) ||
        account.publicAddress.toLowerCase().includes(search) ||
        CurrencyUtils.renderIron(account.balances.default.confirmed).includes(
          search
        )
    )
  }

  async get(id: string): Promise<WalletAccount | null> {
    const account: WalletAccount = this.node.wallet.getAccount(id)?.serialize()
    if (account) {
      account.balances = await this.balances(account.id)
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

  export(id: string): Promise<Omit<AccountValue, 'id'>> {
    const account = this.node.wallet.getAccount(id)?.serialize()
    delete account.id
    return Promise.resolve(account)
  }

  async balance(
    id: string,
    assetId: string = NativeAsset.nativeId().toString('hex')
  ): Promise<AccountBalance> {
    const account = this.node.wallet.getAccount(id)
    if (account) {
      const balance = await this.node.wallet.getBalance(
        account,
        Buffer.from(assetId, 'hex')
      )
      const asset = await this.assetManager.get(assetId)
      return {
        ...balance,
        asset: asset,
      }
    }

    return Promise.reject(new Error(`Account with id=${id} was not found.`))
  }

  async balances(id: string): Promise<{
    default: AccountBalance
    assets: AccountBalance[]
  }> {
    const account = this.node.wallet.getAccount(id)
    if (account) {
      const balances: AccountBalance[] = []
      for await (const balance of this.node.wallet.getBalances(account)) {
        const asset: Asset = await this.assetManager.get(balance.assetId)

        balances.push({
          ...balance,
          asset: asset,
        })
      }

      const defaultAssetID = NativeAsset.nativeId().toString('hex')

      return {
        default: balances.find(b => b.asset.id === defaultAssetID),
        assets: balances.filter(b => b.asset.id !== defaultAssetID),
      }
    }

    return Promise.reject(new Error(`Account with id=${id} was not found.`))
  }
}

export default AccountManager

import { AccountValue, CurrencyUtils, IronfishNode } from '@ironfish/sdk'
import { IIronfishAccountManager } from 'Types/IronfishManager/IIronfishAccountManager'
import { Asset } from '@ironfish/rust-nodejs'
import WalletAccount from 'Types/Account'
import SortType from 'Types/SortType'
import CutAccount from 'Types/CutAccount'
import AccountBalance from 'Types/AccountBalance'

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
        balance: await this.balance(account.id),
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
    await this.node.wallet.removeAccountByName(name)
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
    assetId: Buffer = Asset.nativeId()
  ): Promise<AccountBalance> {
    const account = this.node.wallet.getAccount(id)
    if (account) {
      const balance = await this.node.wallet.getBalance(account, assetId)
      const asset = await this.node.chain.getAssetById(assetId)
      return {
        ...balance,
        asset: {
          id: asset.id.toString('hex'),
          name: asset?.name.toString('utf8') || '',
        },
      }
    }

    return Promise.reject(new Error(`Account with id=${id} was not found.`))
  }
}

export default AccountManager

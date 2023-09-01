import { Asset as NativeAsset } from '@ironfish/rust-nodejs'
import { AssetValue } from '@ironfish/sdk/build/src/blockchain/database/assetValue'
import { GENESIS_BLOCK_PREVIOUS } from '@ironfish/sdk/build/src/primitives/block'
import Asset from 'Types/Asset'
import IIronfishAssetManager from 'Types/IronfishManager/IIronfishAssetManager'
import AbstractManager from './AbstractManager'

class AssetManager extends AbstractManager implements IIronfishAssetManager {
  private DEFAULT_ASSET: AssetValue = {
    createdTransactionHash: GENESIS_BLOCK_PREVIOUS,
    id: NativeAsset.nativeId(),
    metadata: Buffer.from('Native asset of Iron Fish blockchain', 'utf8'),
    name: Buffer.from('$IRON', 'utf8'),
    owner: Buffer.from('Iron Fish', 'utf8'),
    creator: Buffer.from('Iron Fish', 'utf8'),
    supply: BigInt(0),
    nonce: 0,
  }

  async list(search?: string, offset = 0, max = 100): Promise<Asset[]> {
    const assets: Asset[] = []

    const bufferedAssets = [this.DEFAULT_ASSET].concat(
      await this.node.chain.blockchainDb.assets.getAllValues()
    )
    bufferedAssets.forEach((bufferedAsset: AssetValue) => {
      const asset = this.resolveAsset(bufferedAsset)

      if (
        !search ||
        asset.id.includes(search) ||
        asset.name.includes(search) ||
        asset.owner.includes(search) ||
        asset.metadata.includes(search)
      ) {
        assets.push(asset)
      }
    })

    return assets.slice(offset, offset + max)
  }

  async get(id: string | Buffer): Promise<Asset> {
    const identity: Buffer = Buffer.isBuffer(id) ? id : Buffer.from(id, 'hex')

    if (NativeAsset.nativeId() === identity) {
      return this.default()
    }

    const asset = await this.node.chain.getAssetById(identity)

    if (!asset) {
      throw new Error(
        `Asset with id=${identity.toString('hex')} was not found.`
      )
    }

    return this.resolveAsset(asset)
  }

  default(): Promise<Asset> {
    return Promise.resolve(this.resolveAsset(this.DEFAULT_ASSET))
  }

  private resolveAsset(asset: AssetValue): Asset {
    return {
      createdTransactionHash: asset.createdTransactionHash.toString('hex'),
      id: asset.id.toString('hex'),
      name: asset.name.toString('utf8').split('\x00').join(''),
      metadata: asset.metadata.toString('utf8').split('\x00').join(''),
      owner: asset.owner.toString('hex'),
      supply: asset.supply,
    }
  }
}

export default AssetManager

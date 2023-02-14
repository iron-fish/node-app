import { Asset as NativeAsset } from '@ironfish/rust-nodejs'
import { AssetValue } from '@ironfish/sdk/build/src/blockchain/database/assetValue'
import { GENESIS_BLOCK_PREVIOUS } from '@ironfish/sdk/build/src/primitives/block'
import Asset from 'Types/Asset'
import IIronfishAssetManager from 'Types/IronfishManager/IIronfishAssetManager'
import AbstractManager from './AbstractManager'

class AssetManager extends AbstractManager implements IIronfishAssetManager {
  async list(search?: string, offset = 0, max = 100): Promise<Asset[]> {
    const nativeAsset = await this.default()
    const assets: Asset[] = []
    const isMatched = (asset: Asset) =>
      !search ||
      asset.id.includes(search) ||
      asset.name.includes(search) ||
      asset.owner.includes(search) ||
      asset.metadata.includes(search)

    if (isMatched(nativeAsset)) {
      assets.push(nativeAsset)
    }

    const bufferedAssets = await this.node.chain.assets.getAllValues()
    bufferedAssets.forEach((bufferedAsset: AssetValue) => {
      const asset = this.resolveAsset(bufferedAsset)

      if (isMatched(asset)) {
        assets.push(asset)
      }
    })

    return assets.slice(offset, max)
  }

  async get(id: string | Buffer): Promise<Asset | null> {
    const identity: Buffer = Buffer.isBuffer(id) ? id : Buffer.from(id, 'hex')

    if (NativeAsset.nativeId() === identity) {
      return this.default()
    }

    const asset = await this.node.chain.getAssetById(identity)

    return asset ? this.resolveAsset(asset) : null
  }

  default(): Promise<Asset> {
    return Promise.resolve({
      createdTransactionHash: GENESIS_BLOCK_PREVIOUS.toString('hex'),
      id: NativeAsset.nativeId().toString('hex'),
      metadata: 'Native asset of Iron Fish blockchain',
      name: '$IRON',
      owner: 'Iron Fish',
      supply: BigInt(0),
    })
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

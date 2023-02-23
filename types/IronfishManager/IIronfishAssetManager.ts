import Asset from 'Types/Asset'

export enum IronfishAssetManagerActions {
  LIST = 'list',
  GET = 'get',
  DEFAULT = 'default',
}

interface IIronfishAssetManager {
  list: (search?: string, offset?: number, max?: number) => Promise<Asset[]>
  get: (id: string | Buffer) => Promise<Asset>
  default: () => Promise<Asset>
}

export default IIronfishAssetManager

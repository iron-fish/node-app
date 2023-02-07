import Asset from 'Types/Asset'

export enum IronfishAssetManagerActions {
  LIST = 'list',
  GET = 'get',
}

interface IIronfishAssetManager {
  list: (search?: string, offset?: number, max?: number) => Promise<Asset[]>
  get: (id: string) => Promise<Asset | null>
}

export default IIronfishAssetManager

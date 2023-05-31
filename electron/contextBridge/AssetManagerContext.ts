import IIronfishAssetManager, {
  IronfishAssetManagerActions,
} from 'Types/IronfishManager/IIronfishAssetManager'
import { invoke } from './util'

class AssetManagerContext implements IIronfishAssetManager {
  list = (search?: string, offset?: number, max?: number) => {
    return invoke(
      'ironfish-manager-assets',
      IronfishAssetManagerActions.LIST,
      search,
      offset,
      max
    )
  }
  get = (id: string | Buffer) => {
    return invoke(
      'ironfish-manager-assets',
      IronfishAssetManagerActions.GET,
      id
    )
  }
  default = () => {
    return invoke(
      'ironfish-manager-assets',
      IronfishAssetManagerActions.DEFAULT
    )
  }
}

export default new AssetManagerContext()

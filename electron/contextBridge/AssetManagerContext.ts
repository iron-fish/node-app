import { ipcRenderer } from 'electron'
import IIronfishAssetManager, {
  IronfishAssetManagerActions,
} from 'Types/IronfishManager/IIronfishAssetManager'

class AssetManagerContext implements IIronfishAssetManager {
  list = (search?: string, offset?: number, max?: number) => {
    return ipcRenderer.invoke(
      'ironfish-manager-assets',
      IronfishAssetManagerActions.LIST,
      search,
      offset,
      max
    )
  }
  get = (id: string | Buffer) => {
    return ipcRenderer.invoke(
      'ironfish-manager-assets',
      IronfishAssetManagerActions.GET,
      id
    )
  }
  default = () => {
    return ipcRenderer.invoke(
      'ironfish-manager-assets',
      IronfishAssetManagerActions.DEFAULT
    )
  }
}

export default new AssetManagerContext()

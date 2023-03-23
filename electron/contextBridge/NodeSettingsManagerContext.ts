import { ConfigOptions } from '@ironfish/sdk'
import { ipcRenderer } from 'electron'
import {
  INodeSettingsManager,
  NodeSettingsManagerAction,
} from 'Types/IronfishManager/INodeSettingsManager'

class NodeSettingsManagerContext implements INodeSettingsManager {
  getConfig = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      NodeSettingsManagerAction.GET_CONFIG
    )
  }
  setValues = (values: Partial<ConfigOptions>) => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      NodeSettingsManagerAction.SET_VALUES,
      values
    )
  }
  save = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      NodeSettingsManagerAction.SAVE
    )
  }
  clearConfig = () => {
    return ipcRenderer.invoke(
      'ironfish-manager',
      NodeSettingsManagerAction.CLEAR_CONFIG
    )
  }
}

export default new NodeSettingsManagerContext()

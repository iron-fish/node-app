import { ConfigOptions } from '@ironfish/sdk'
import {
  INodeSettingsManager,
  NodeSettingsManagerAction,
} from 'Types/IronfishManager/INodeSettingsManager'
import { invoke } from './util'

class NodeSettingsManagerContext implements INodeSettingsManager {
  getConfig = () => {
    return invoke('ironfish-manager', NodeSettingsManagerAction.GET_CONFIG)
  }
  setValues = (values: Partial<ConfigOptions>) => {
    return invoke(
      'ironfish-manager',
      NodeSettingsManagerAction.SET_VALUES,
      values
    )
  }
  save = () => {
    return invoke('ironfish-manager', NodeSettingsManagerAction.SAVE)
  }
  clearConfig = () => {
    return invoke('ironfish-manager', NodeSettingsManagerAction.CLEAR_CONFIG)
  }
}

export default new NodeSettingsManagerContext()

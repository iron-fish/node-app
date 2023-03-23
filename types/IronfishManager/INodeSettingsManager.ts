import { ConfigOptions } from '@ironfish/sdk'

export enum NodeSettingsManagerAction {
  GET_CONFIG = 'getConfig',
  SET_VALUES = 'setValues',
  SAVE = 'save',
  CLEAR_CONFIG = 'clearConfig',
}

export interface INodeSettingsManager {
  getConfig: () => Promise<Partial<ConfigOptions>>
  setValues: (values: Partial<ConfigOptions>) => Promise<void>
  save: () => Promise<void>
  clearConfig: () => Promise<void>
}

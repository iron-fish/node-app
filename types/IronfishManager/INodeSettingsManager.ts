import { ConfigOptions } from '@ironfish/sdk'

export interface INodeSettingsManager {
  getConfig: () => Partial<ConfigOptions>
  setValues: (values: Partial<ConfigOptions>) => void
  save: () => Promise<void>
  clearConfig: () => void
}

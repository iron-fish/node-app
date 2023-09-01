import {
  FullNode,
  setUnknownConfigValue,
  Config,
  ConfigOptions,
} from '@ironfish/sdk'
import { INodeSettingsManager } from 'Types/IronfishManager/INodeSettingsManager'
import AbstractManager from './AbstractManager'

class NodeSettingsManager
  extends AbstractManager
  implements INodeSettingsManager
{
  private config: Config

  constructor(node: FullNode) {
    super(node)
    this.config = node.config
  }

  getConfig(): Promise<Partial<ConfigOptions>> {
    return Promise.resolve({
      ...this.config.defaults,
      ...this.config.loaded,
    })
  }

  setValues(values: Partial<ConfigOptions>): Promise<void> {
    for (const key in values) {
      if (key in this.config.defaults) {
        setUnknownConfigValue(
          this.config,
          key,
          values[key as keyof ConfigOptions]
        )
      }
    }

    return Promise.resolve()
  }

  async save(): Promise<void> {
    return this.config.save()
  }

  async clearConfig(): Promise<void> {
    this.config.loaded = {}
  }
}

export default NodeSettingsManager

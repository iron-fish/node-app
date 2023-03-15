import {
  IronfishNode,
  setUnknownConfigValue,
  Config,
  ConfigOptions,
} from '@ironfish/sdk'
import { INodeSettingsManager } from 'Types/IronfishManager/INodeSettingsManager'

class NodeSettingsManager implements INodeSettingsManager {
  private config: Config

  constructor(node: IronfishNode) {
    this.config = node.config
  }

  getConfig(): Partial<ConfigOptions> {
    return {
      ...this.config.defaults,
      ...this.config.loaded,
    }
  }

  setValues(values: Partial<ConfigOptions>): void {
    for (const key in values) {
      if (key in this.config.defaults) {
        setUnknownConfigValue(
          this.config,
          key,
          values[key as keyof ConfigOptions]
        )
      }
    }
  }

  async save(): Promise<void> {
    return this.config.save()
  }

  async clearConfig(): Promise<void> {
    this.config.loaded = {}
  }
}

export default NodeSettingsManager

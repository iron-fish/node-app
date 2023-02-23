import { ConfigOptions } from '@ironfish/sdk'
import { STATUS } from './DemoNodeManager'

let DEMO_NODE_CONFIG: Partial<ConfigOptions> = {
  nodeName: STATUS.node.nodeName,
  blockGraffiti: '',
  nodeWorkers: 6,
  minPeers: -1,
  maxPeers: 50,
  blocksPerMessage: 5,
}

let DEMO_NODE_CONFIG_TMP: Partial<ConfigOptions> = {}

class DemoNodeSettingsManager {
  private setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value
  }

  getConfig(): Partial<ConfigOptions> {
    return { ...DEMO_NODE_CONFIG, ...DEMO_NODE_CONFIG_TMP }
  }

  setValues(values: Partial<ConfigOptions>): void {
    for (const key in values) {
      if (key in DEMO_NODE_CONFIG) {
        this.setProperty(
          DEMO_NODE_CONFIG_TMP,
          key as keyof ConfigOptions,
          values[key as keyof ConfigOptions]
        )
      }
    }
  }

  async save(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (DEMO_NODE_CONFIG_TMP.nodeName) {
          STATUS.node.nodeName = DEMO_NODE_CONFIG_TMP.nodeName
        }
        DEMO_NODE_CONFIG = { ...DEMO_NODE_CONFIG, ...DEMO_NODE_CONFIG_TMP }
        DEMO_NODE_CONFIG_TMP = {}
        resolve()
      }, 500)
    })
  }

  clearConfig(): void {
    DEMO_NODE_CONFIG = {}
  }
}

export default DemoNodeSettingsManager

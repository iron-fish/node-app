import { IronfishNode } from '@ironfish/sdk'

abstract class AbstractManager {
  protected node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initEventListeners() {}
}

export default AbstractManager

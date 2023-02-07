import { IronfishNode } from '@ironfish/sdk'

class AbstractManager {
  protected node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }
}

export default AbstractManager

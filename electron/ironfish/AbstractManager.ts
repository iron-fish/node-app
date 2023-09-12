import { FullNode } from '@ironfish/sdk'

abstract class AbstractManager {
  protected node: FullNode

  constructor(node: FullNode) {
    this.node = node
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initEventListeners() {}
}

export default AbstractManager

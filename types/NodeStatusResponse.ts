export enum NodeStatusType {
  STARTED = 'started',
  STOPPED = 'stopped',
  ERROR = 'error',
}

export interface NodeStatusResponse {
  node: {
    status: NodeStatusType
    nodeName: string
  }
  cpu: {
    cores: number
    percentRollingAvg: number
    percentCurrent: number
  }
  memory: {
    heapMax: number
    heapTotal: number
    heapUsed: number
    rss: number
    memFree: number
    memTotal: number
  }
  peerNetwork: {
    peers: number
    isReady: boolean
    inboundTraffic: number
    outboundTraffic: number
  }
  blockchain: {
    synced: boolean
    head: string
    totalSequences: string
    headTimestamp: number
    newBlockSpeed: number
  }
  blockSyncer: {
    status: 'stopped' | 'idle' | 'stopping' | 'syncing'
    syncing?: {
      blockSpeed: number
      speed: number
      progress: number
      ours?: string
    }
  }
}

export default NodeStatusResponse

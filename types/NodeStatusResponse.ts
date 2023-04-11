export enum NodeStatusType {
  STARTED = 'started',
  STOPPED = 'stopped',
  ERROR = 'error',
}

export type NodeStatusResponse = Partial<{
  node: {
    status: NodeStatusType
    nodeName: string
  }
  cpu: Partial<{
    cores: number
    percentRollingAvg: number
    percentCurrent: number
  }>
  memory: Partial<{
    heapMax: number
    heapTotal: number
    heapUsed: number
    rss: number
    memFree: number
    memTotal: number
  }>
  peerNetwork: Partial<{
    peers: number
    isReady: boolean
    inboundTraffic: number
    outboundTraffic: number
  }>
  blockchain: Partial<{
    synced: boolean
    head: string
    totalSequences: string
    headTimestamp: number
    newBlockSpeed: number
  }>
  blockSyncer: Partial<{
    status: 'stopped' | 'idle' | 'stopping' | 'syncing'
    syncing: Partial<{
      blockSpeed: number
      speed: number
      progress: number
      ours: string
    }>
  }>
}>

export default NodeStatusResponse

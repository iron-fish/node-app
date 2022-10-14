import {
  PeerResponse,
  GetNodeStatusResponse as GetStatusResponse,
} from '@ironfish/sdk'

const STATUS: GetStatusResponse = {
  node: {
    status: 'started',
    version: '1.2.1',
    git: 'something',
    nodeName: 'My Node Name Example',
  },
  memory: {
    heapMax: 1250,
    heapTotal: 1054,
    heapUsed: Math.random() * 1000,
    rss: 234,
    memFree: Math.random() * 4000,
    memTotal: 4232,
  },
  cpu: {
    cores: 8,
    percentRollingAvg: 7,
    percentCurrent: 24,
  },
  miningDirector: {
    status: 'started',
    miners: 1,
    blocks: 1243,
    blockGraffiti: 'test',
    newBlockTemplateSpeed: Math.random() * 1000,
    newBlockTransactionsSpeed: Math.random() * 1000,
  },
  memPool: {
    size: 12,
    sizeBytes: 12 * 1024 * 8,
  },
  blockchain: {
    synced: true,
    head: 'asmdksalkdajlkdjalskdjlksajlkasjdlksajdlksaj',
    headTimestamp: new Date().getTime(),
    newBlockSpeed: Math.random() * 1000,
  },
  blockSyncer: {
    status: 'stopped',
    syncing: {
      blockSpeed: Math.random() * 100,
      speed: Math.random() * 1000,
      progress: 98,
    },
  },
  peerNetwork: {
    peers: 23,
    isReady: true,
    inboundTraffic: Math.random() * 100,
    outboundTraffic: Math.random() * 100,
  },
  telemetry: {
    status: 'started',
    pending: 0,
    submitted: 12,
  },
  workers: {
    started: false,
    workers: 1,
    queued: 0,
    capacity: 0,
    executing: 0,
    change: 0,
    speed: 0,
  },
  accounts: {
    scanning: {
      sequence: 123123,
      endSequence: 1232312,
      startedAt: 123123213,
    },
    head: 'ddsalkjfhkdsjhfkjdshfkjsdhfkjsdf',
  },
}

const PEERS: PeerResponse[] = Array(23)
  .fill(null)
  .map(() => ({
    state: 'active',
    identity: (Math.random() * 1000000).toFixed(3),
    version: 1024,
    head: 'ksajdlkasjdlsakjdaksdj',
    sequence: 2048,
    work: 'active',
    agent: 'test',
    name: 'Websocket',
    address: 'jalkaslkdjsaldjsalkdjlsakdjlksad',
    port: 8080,
    error: '',
    connections: 12,
    connectionWebSocket: '',
    connectionWebSocketError: '',
    connectionWebRTC: '',
    connectionWebRTCError: '',
  }))

class DemoNodeManager {
  status(): Promise<GetStatusResponse> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...STATUS,
          peerNetwork: {
            ...STATUS.peerNetwork,
            inboundTraffic: Math.abs(
              STATUS.peerNetwork.inboundTraffic + (0.5 - Math.random()) * 10
            ),
            outboundTraffic: Math.abs(
              STATUS.peerNetwork.outboundTraffic + (0.5 - Math.random()) * 10
            ),
          },
        })
      }, 500)
    })
  }

  peers(): Promise<PeerResponse[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(PEERS)
      }, 500)
    })
  }
}

export default DemoNodeManager

import { GetStatusResponse, PeerResponse } from '@ironfish/sdk'
import { BlockSyncerStatusType } from 'Types/BlockSyncerStatusType'

const BLOCK_SPEED = 60000

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
  miningDirector: {
    status: 'started',
    miners: 1,
    blocks: 1243,
    blockGraffiti: 'test',
  },
  memPool: {
    size: 12,
  },
  blockchain: {
    synced: true,
    head: 'asmdksalkdajlkdjalskdjlksajlkasjdlksajdlksaj',
  },
  blockSyncer: {
    status: 'stopped',
    syncing: {
      blockSpeed: BLOCK_SPEED,
      speed: BLOCK_SPEED / 100,
      progress: 0.01,
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
        if (STATUS.blockSyncer.status === BlockSyncerStatusType.SYNCING) {
          STATUS.blockSyncer.syncing.blockSpeed -=
            STATUS.blockSyncer.syncing.speed
          STATUS.blockSyncer.syncing.progress += 0.01
        } else {
          STATUS.blockSyncer.syncing.blockSpeed = BLOCK_SPEED
          STATUS.blockSyncer.syncing.progress = 0.0
        }
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

  syncData(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        STATUS.blockSyncer.status = 'syncing'
        setTimeout(() => {
          STATUS.blockSyncer.status = 'idle'
        }, BLOCK_SPEED)
        resolve()
      }, 500)
    })
  }
}

export default DemoNodeManager

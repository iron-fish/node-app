import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'
import Peer from 'Types/Peer'
import { BlockSyncerStatusType } from 'Types/BlockSyncerStatusType'
import { nanoid } from 'nanoid'

const BLOCK_SPEED = 60000

export const STATUS: NodeStatusResponse = {
  node: {
    status: NodeStatusType.STARTED,
    nodeName: 'My Node Name Example',
  },
  cpu: {
    cores: 4,
    percentRollingAvg: Math.random() * 100,
    percentCurrent: Math.random() * 100,
  },
  memory: {
    heapMax: Math.random() * 100,
    heapTotal: Math.random() * 100,
    heapUsed: Math.random() * 100,
    rss: Math.random() * 100,
    memFree: Math.random() * 100,
    memTotal: Math.random() * 100,
  },
  blockchain: {
    synced: false,
    head: '0',
    totalSequences: '23344',
    headTimestamp: new Date().getTime(),
    newBlockSpeed: Math.random() * 1000,
  },
  blockSyncer: {
    status: 'syncing',
    syncing: {
      blockSpeed: BLOCK_SPEED,
      speed: BLOCK_SPEED / 50,
      progress: 0.01,
    },
  },
  peerNetwork: {
    peers: 23,
    isReady: true,
    inboundTraffic: Math.random() * 100,
    outboundTraffic: Math.random() * 100,
  },
  accounts: [
    {
      id: 'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
      sequence: '20000',
    },
    {
      id: 'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
      sequence: '23330',
    },
    {
      id: 'q1Pr8GLyskDXbBSUM3DMGOOlrNWv5RFloVr57YGxWrh98Afwz5nDCL1nbMIxfhA7',
      sequence: '23344',
    },
  ],
}

const PEERS: Peer[] = Array(23)
  .fill(null)
  .map(() => {
    const type = Math.random()
    return {
      state: 'active',
      identity: nanoid(64),
      version: 1024,
      head: 'ksajdlkasjdlsakjdaksdj',
      sequence: 2048,
      work: 'active',
      agent: 'test',
      name: 'Websocket',
      address: Array(4)
        .fill(null)
        .map(() => Math.floor((Math.random() * 1000) % 255))
        .join('.'),
      country: ['US', 'CA', 'AR', 'BY', 'RU', 'AU', 'BE', 'GB', 'FR', 'ES'][
        Math.floor(Math.random() * 10)
      ],
      port: 8080,
      error: '',
      connections: 12,
      connectionWebSocket: type > 0.5 ? 'CONNECTED' : '',
      connectionWebSocketError: '',
      connectionWebRTC: type < 0.5 ? 'CONNECTED' : '',
      connectionWebRTCError: '',
      networkId: 13,
      genesisBlockHash: 'peer.genesisBlockHash',
    }
  })

class DemoNodeManager {
  private interval: NodeJS.Timer
  complete(): void {
    STATUS.blockSyncer.syncing.progress = 0.93
    STATUS.blockchain.head = Math.round(
      Number(STATUS.blockchain.totalSequences) * 0.93
    ).toString()
    this.sync()
  }
  private update() {
    const head = Number(STATUS.blockchain.head)
    const total = Number(STATUS.blockchain.totalSequences)
    if (head === total) {
      STATUS.blockSyncer.status = BlockSyncerStatusType.IDLE
    }
    if (STATUS.blockSyncer.status === BlockSyncerStatusType.SYNCING) {
      STATUS.blockchain.synced = false
      STATUS.blockSyncer.syncing.blockSpeed = Math.random() * 10
      STATUS.blockSyncer.syncing.speed =
        total - head > STATUS.blockSyncer.syncing.speed
          ? STATUS.blockSyncer.syncing.speed
          : total - head
      STATUS.blockchain.head = (
        head +
        (total - head > STATUS.blockSyncer.syncing.speed
          ? STATUS.blockSyncer.syncing.speed
          : total - head)
      ).toString()
      STATUS.blockSyncer.syncing.progress = head / total
    } else {
      STATUS.blockchain.synced = true
      STATUS.blockSyncer.syncing.blockSpeed = BLOCK_SPEED
      STATUS.blockSyncer.syncing.progress = 100.0
    }
  }
  sync(): Promise<void> {
    STATUS.blockSyncer.status = BlockSyncerStatusType.SYNCING
    if (!this.interval) {
      this.interval = setInterval(() => this.update(), 500)
    }

    return new Promise(resolve => setTimeout(resolve, 500))
  }
  stopSyncing(): Promise<void> {
    STATUS.blockSyncer.status = BlockSyncerStatusType.STOPPED
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    return new Promise(resolve => setTimeout(resolve, 500))
  }
  status(): Promise<NodeStatusResponse> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...STATUS,
          cpu: {
            cores: 4,
            percentRollingAvg: Math.random() * 100,
            percentCurrent: Math.random() * 100,
          },
          memory: {
            heapMax: Math.random() * 1000,
            heapTotal: Math.random() * 1000,
            heapUsed: Math.random() * 1000,
            rss: Math.random() * 1000,
            memFree: Math.random() * 1000,
            memTotal: Math.random() * 10000,
          },
          peerNetwork: {
            ...STATUS.peerNetwork,
            inboundTraffic: Math.abs(
              STATUS.peerNetwork.inboundTraffic + (0.5 - Math.random()) * 100000
            ),
            outboundTraffic: Math.abs(
              STATUS.peerNetwork.outboundTraffic +
                (0.5 - Math.random()) * 100000
            ),
          },
        })
      }, 500)
    })
  }

  peers(): Promise<Peer[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(PEERS)
      }, 500)
    })
  }

  chainProgress(): Promise<number> {
    return Promise.resolve(STATUS.blockSyncer.syncing?.progress || null)
  }
}

export default DemoNodeManager

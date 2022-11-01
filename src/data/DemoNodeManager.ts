import { PeerResponse } from '@ironfish/sdk'
import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'
import { BlockSyncerStatusType } from 'Types/StatusTypes'

const BLOCK_SPEED = 60000

const STATUS: NodeStatusResponse = {
  node: {
    status: NodeStatusType.STARTED,
    nodeName: 'My Node Name Example',
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
  status(): Promise<NodeStatusResponse> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (STATUS.blockSyncer.status === BlockSyncerStatusType.SYNCING) {
          const head = Number(STATUS.blockchain.head)
          const total = Number(STATUS.blockchain.totalSequences)
          STATUS.blockchain.synced = false
          STATUS.blockSyncer.syncing.blockSpeed -=
            STATUS.blockSyncer.syncing.speed
          STATUS.blockchain.head = (
            head + (total - head > 60 ? 60 : total - head)
          ).toString()
          STATUS.blockSyncer.syncing.progress = head / total
        } else {
          STATUS.blockchain.synced = true
          STATUS.blockSyncer.syncing.blockSpeed = BLOCK_SPEED
          STATUS.blockSyncer.syncing.progress = 100.0
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
}

export default DemoNodeManager

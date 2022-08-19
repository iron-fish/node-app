import { GetStatusResponse } from '@ironfish/sdk'
import { useEffect, useState } from 'react'

const generateStatus = () =>
  ({
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
  } as GetStatusResponse)

const useNodeStatus = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [status, setNodeStatus] = useState<GetStatusResponse | undefined>()
  const [error, setError] = useState()

  const loadStatus = () => {
    const promise = new Promise(resolve =>
      setTimeout(() => resolve(generateStatus()), 500)
    )
    return promise
      .then(setNodeStatus)
      .catch(setError)
      .finally(() => setLoaded(true))
  }

  useEffect(() => {
    const infinite = setInterval(() => {
      loadStatus()
    }, 1000)
    return () => clearInterval(infinite)
  }, [])

  return {
    loaded,
    data: status,
    error,
  }
}

export default useNodeStatus

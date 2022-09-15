import { PeerResponse } from '@ironfish/sdk'
import { useEffect } from 'react'
import useAsyncDataWrapper from './useAsyncDataWrapper'

const generatePeers: () => PeerResponse[] = () => {
  // eslint-disable-next-line prefer-spread
  return Array.apply(null, Array(23)).map(() => ({
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
}

const useNodePeers = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<PeerResponse[]>()

  const loadPeers = () =>
    promiseWrapper(
      new Promise<PeerResponse[]>(res =>
        setTimeout(() => res(generatePeers()), 500)
      )
    )

  useEffect(() => {
    loadPeers()
  }, [])

  return result
}

export default useNodePeers

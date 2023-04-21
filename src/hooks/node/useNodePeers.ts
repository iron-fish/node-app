import { useEffect } from 'react'
import Peer from 'Types/Peer'
import useAsyncDataWrapper from '../useAsyncDataWrapper'
import EventType from 'Types/EventType'

const useNodePeers = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Peer[]>()

  const loadPeers = () => {
    window.subscribeOn(EventType.PEERS_CHANGE, (peers: Peer[]) =>
      promiseWrapper(Promise.resolve(peers))
    )
    return promiseWrapper(window.IronfishManager.peers())
  }

  useEffect(() => {
    loadPeers()
  }, [])

  return result
}

export default useNodePeers

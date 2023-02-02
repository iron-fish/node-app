import { useEffect } from 'react'
import Peer from 'Types/Peer'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useNodePeers = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Peer[]>()

  const loadPeers = () => promiseWrapper(window.IronfishManager.peers())

  useEffect(() => {
    const infinite = setInterval(() => {
      loadPeers()
    }, 5000)
    return () => clearInterval(infinite)
  }, [])

  return result
}

export default useNodePeers

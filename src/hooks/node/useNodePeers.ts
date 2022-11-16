import { PeerResponse } from '@ironfish/sdk'
import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useNodePeers = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<PeerResponse[]>()

  const loadPeers = () => promiseWrapper(window.IronfishManager.peers())

  useEffect(() => {
    const infinite = setInterval(() => {
      loadPeers()
    }, 1000)
    return () => clearInterval(infinite)
  }, [])

  return result
}

export default useNodePeers

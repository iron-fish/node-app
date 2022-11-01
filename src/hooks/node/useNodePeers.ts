import { PeerResponse } from '@ironfish/sdk'
import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useNodePeers = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<PeerResponse[]>()

  const loadPeers = () => promiseWrapper(window.IronfishManager.peers())

  useEffect(() => {
    loadPeers()
  }, [])

  return result
}

export default useNodePeers

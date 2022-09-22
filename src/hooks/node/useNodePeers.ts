import { PeerResponse } from '@ironfish/sdk'
import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useNodePeers = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<PeerResponse[]>()

  const loadPeers = () => promiseWrapper(window.DemoDataManager.getNodePeers())

  useEffect(() => {
    loadPeers()
  }, [])

  return result
}

export default useNodePeers

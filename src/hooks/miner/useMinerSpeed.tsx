import { useEffect, useState } from 'react'

interface SpeedRow {
  time: Date
  value: number
}

const useMinerSpeed = (periodOfUpdate = 500, maxStoreLength = 50) => {
  const [store, setStore] = useState<SpeedRow[]>([])

  const loadMinerSpeed = () => {
    return window.DemoDataManager.getAccountMinerSpeed().then(data => {
      if (store.length === maxStoreLength) {
        store.shift()
      }
      store.push({ time: new Date(), value: data.speed })
      setStore([...store])
    })
  }

  useEffect(() => {
    const interval = setInterval(loadMinerSpeed, periodOfUpdate)

    return () => clearInterval(interval)
  }, [periodOfUpdate, maxStoreLength])

  return store
}

export default useMinerSpeed

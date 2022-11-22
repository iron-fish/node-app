import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'

const useFee = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<number>()

  const calculateFee = () =>
    promiseWrapper(window.IronfishManager.transactions.averageFee(10))

  useEffect(() => {
    calculateFee()
  }, [])

  return result
}

export default useFee

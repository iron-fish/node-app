import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'

const useFee = (amount: number) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<number>()

  const calculateFee = () =>
    promiseWrapper(window.DemoDataManager.calculateFee(amount))

  useEffect(() => {
    calculateFee()
  }, [amount])

  return result
}

export default useFee

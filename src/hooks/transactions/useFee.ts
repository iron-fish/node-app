import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import {
  TransactionFeeEstimate,
  TransactionReceiver,
} from 'Types/IIronfishManager'

const useFee = (accountId: string, receiver: TransactionReceiver) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<TransactionFeeEstimate>()

  const calculateFee = () => {
    if (accountId && receiver.amount) {
      return promiseWrapper(
        window.IronfishManager.transactions.estimateFeeWithPriority(
          accountId,
          receiver
        )
      )
    }
  }

  useEffect(() => {
    calculateFee()
  }, [
    accountId,
    JSON.stringify(receiver, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ),
  ])

  return result
}

export default useFee

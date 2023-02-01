import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import {
  TransactionFeeEstimate,
  TransactionReceiver,
} from 'Types/IronfishManager/IIronfishTransactionManager'
import { Payment } from 'Types/Transaction'

const useFee = (accountId: string, receiver: TransactionReceiver) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<TransactionFeeEstimate>()

  const calculateFee = () => {
    if (accountId && (receiver?.amount || receiver?.amount === BigInt(0))) {
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

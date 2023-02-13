import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { TransactionFeeEstimate } from 'Types/IronfishManager/IIronfishTransactionManager'
import { Payment } from 'Types/Transaction'

const useEstimatedFee = (accountId: string, receiver: Payment) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<TransactionFeeEstimate>()

  const calculateFee = () => {
    if (
      accountId &&
      receiver.publicAddress &&
      (receiver?.amount || receiver?.amount === BigInt(0))
    ) {
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

export default useEstimatedFee

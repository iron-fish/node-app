import { useEffect } from 'react'
import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { TransactionFeeEstimate } from 'Types/IronfishManager/IIronfishTransactionManager'
import { Payment } from 'Types/Transaction'

const useEstimatedFee = (
  accountId: string,
  receiver: Payment,
  assetId: string
) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<TransactionFeeEstimate>()

  const calculateFee = () => {
    if (
      accountId &&
      receiver.publicAddress &&
      (receiver?.amount || receiver?.amount === BigInt(0)) &&
      assetId
    ) {
      return promiseWrapper(
        window.IronfishManager.transactions.estimateFeeWithPriority(
          accountId,
          receiver,
          assetId
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

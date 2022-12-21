import { ORE_TO_IRON } from 'Utils/number'
import { useEffect, useState } from 'react'
import Transaction, { TransactionStatus } from 'Types/Transaction'

const useSendFlow = (
  accountId: string,
  amount: number,
  memo: string,
  to: string,
  fee?: number
) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const send = () =>
    window.IronfishManager.transactions
      .pay(
        accountId,
        {
          amount: BigInt(amount * ORE_TO_IRON),
          memo: memo,
          publicAddress: to,
        },
        fee * ORE_TO_IRON
      )
      .then(setTransaction)

  const syncTransaction = () =>
    transaction &&
    window.IronfishManager.transactions
      .get(transaction.hash, transaction.accountId)
      .then(setTransaction)

  useEffect(() => {
    send()
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timer
    if (
      transaction &&
      transaction.status !== TransactionStatus.CONFIRMED &&
      transaction.status !== TransactionStatus.EXPIRED
    ) {
      timeout = setInterval(() => syncTransaction(), 1000)
    }

    return () => {
      timeout && clearInterval(timeout)
    }
  }, [transaction?.status])

  return transaction
}

export default useSendFlow

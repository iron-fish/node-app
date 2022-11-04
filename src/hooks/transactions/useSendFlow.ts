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
          amount: amount,
          memo: memo,
          publicAddress: to,
        },
        fee
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
      timeout = setInterval(() => syncTransaction())
    }

    return () => {
      timeout && clearInterval(timeout)
    }
  }, [transaction?.status])

  return transaction
}

export default useSendFlow

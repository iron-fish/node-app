import { useEffect, useState } from 'react'
import Transaction, { TransactionStatus } from 'Types/Transaction'

const useSendFlow = (
  accountId: string,
  amount: bigint,
  memo: string,
  to: string,
  assetId: string,
  fee?: bigint
) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const send = () =>
    window.IronfishManager.transactions
      .send(
        accountId,
        {
          amount,
          memo,
          publicAddress: to,
          assetId,
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
      timeout = setInterval(() => syncTransaction(), 1000)
    }

    return () => {
      timeout && clearInterval(timeout)
    }
  }, [transaction?.status])

  return transaction
}

export default useSendFlow

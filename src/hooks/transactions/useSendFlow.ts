import { useEffect, useState } from 'react'
import Transaction from 'Types/Transaction'
import Asset from 'Types/Asset'

const useSendFlow = (
  accountId: string,
  amount: bigint,
  memo: string,
  to: string,
  assetId: string,
  fee?: bigint
) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [feeAsset, setFeeAsset] = useState<Asset>()

  useEffect(() => {
    window.IronfishManager.assets.default().then(setFeeAsset)
  }, [])

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

  return { transaction, feeAsset, actions: { send } }
}

export default useSendFlow

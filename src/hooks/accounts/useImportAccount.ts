import { nanoid } from 'nanoid'
import { useCallback } from 'react'

const useImportAccount = () => {
  const importAccountBySpendingKey = useCallback(
    spendingKey =>
      window.IronfishManager.accounts.import({
        incomingViewKey: nanoid(64),
        outgoingViewKey: nanoid(64),
        name: 'Imported Account',
        publicAddress: nanoid(64),
        spendingKey: spendingKey,
      }),
    []
  )
  const importAccountByMnemonicPhrase = useCallback(
    mnemonicPhrase =>
      window.IronfishManager.accounts.import({
        incomingViewKey: nanoid(64),
        outgoingViewKey: nanoid(64),
        name: 'Imported Account',
        publicAddress: nanoid(64),
        spendingKey: nanoid(64),
      }),
    []
  )
  const importAccountByFile = useCallback(
    file =>
      window.IronfishManager.accounts.import({
        incomingViewKey: nanoid(64),
        outgoingViewKey: nanoid(64),
        name: 'Imported Account',
        publicAddress: nanoid(64),
        spendingKey: nanoid(64),
      }),
    []
  )

  return [
    importAccountBySpendingKey,
    importAccountByMnemonicPhrase,
    importAccountByFile,
  ] as const
}

export default useImportAccount

import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import Account from 'Types/Account'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'

const useImportAccount = () => {
  const importAccountBySpendingKey = useCallback(
    (spendingKey: string) =>
      window.IronfishManager.accounts.import({
        id: nanoid(64),
        incomingViewKey: nanoid(64),
        outgoingViewKey: nanoid(64),
        name: 'Imported Account',
        publicAddress: nanoid(64),
        spendingKey: spendingKey,
        viewKey: nanoid(64),
        version: 1,
      }),
    []
  )
  const importAccountByMnemonicPhrase = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (mnemonicPhrase: MnemonicPhraseType) =>
      window.IronfishManager.accounts.import({
        id: nanoid(64),
        incomingViewKey: nanoid(64),
        outgoingViewKey: nanoid(64),
        name: 'Imported Account',
        publicAddress: nanoid(64),
        spendingKey: nanoid(64),
        viewKey: nanoid(64),
        version: 1,
      }),
    []
  )
  const importAccountByFile = useCallback(
    (account: Account) => window.IronfishManager.accounts.import(account),
    []
  )

  return [
    importAccountBySpendingKey,
    importAccountByMnemonicPhrase,
    importAccountByFile,
  ] as const
}

export default useImportAccount

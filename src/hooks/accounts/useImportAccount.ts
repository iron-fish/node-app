import { useCallback } from 'react'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'

const useImportAccount = () => {
  const importAccountBySpendingKey = useCallback(
    (spendingKey: string) =>
      window.DemoDataManager.importAccountBySpendingKey(spendingKey),
    []
  )
  const importAccountByMnemonicPhrase = useCallback(
    (mnemonicPhrase: MnemonicPhraseType) =>
      window.DemoDataManager.importAccountByMnemonicPhrase(mnemonicPhrase),
    []
  )
  const importAccountByFile = useCallback(
    (file: File) => window.DemoDataManager.importAccountByFile(file),
    []
  )

  return [
    importAccountBySpendingKey,
    importAccountByMnemonicPhrase,
    importAccountByFile,
  ] as const
}

export default useImportAccount

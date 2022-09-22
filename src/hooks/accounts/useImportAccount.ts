import { useCallback } from 'react'

const useImportAccount = () => {
  const importAccountBySpendingKey = useCallback(
    spendingKey =>
      window.DemoDataManager.importAccountBySpendingKey(spendingKey),
    []
  )
  const importAccountByMnemonicPhrase = useCallback(
    mnemonicPhrase =>
      window.DemoDataManager.importAccountByMnemonicPhrase(mnemonicPhrase),
    []
  )
  const importAccountByFile = useCallback(
    file => window.DemoDataManager.importAccountByFile(file),
    []
  )

  return [
    importAccountBySpendingKey,
    importAccountByMnemonicPhrase,
    importAccountByFile,
  ] as const
}

export default useImportAccount

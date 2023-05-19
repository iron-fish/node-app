import { useCallback } from 'react'
import Account from 'Types/Account'

const useImportAccount = () => {
  const importAccountByData = useCallback(
    (data: string) => window.IronfishManager.accounts.importByEncodedKey(data),
    []
  )
  const importAccountByMnemonicPhrase = useCallback(
    (name: string, mnemonic: string) =>
      window.IronfishManager.accounts.importByMnemonic(name, mnemonic),
    []
  )
  const importAccountByFile = useCallback(
    (account: Account) =>
      window.IronfishManager.accounts.import({ ...account, createdAt: null }),
    []
  )

  return [
    importAccountByData,
    importAccountByMnemonicPhrase,
    importAccountByFile,
  ] as const
}

export default useImportAccount

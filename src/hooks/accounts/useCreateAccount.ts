import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useCallback, useEffect } from 'react'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'

const useCreateAccount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<string[]>()
  const createAccount = useCallback(
    (name: string, mnemonicPhrase: MnemonicPhraseType) =>
      window.DemoDataManager.createAccount(name, mnemonicPhrase),
    []
  )

  const generateMnemonic = () =>
    promiseWrapper(window.DemoDataManager.generateMnemonic())

  useEffect(() => {
    generateMnemonic()
  }, [])

  return [result, createAccount, generateMnemonic] as const
}

export default useCreateAccount

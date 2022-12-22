import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useCallback, useEffect } from 'react'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'

const useCreateAccount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<string[]>()
  const createAccount = useCallback(
    (name: string) => window.IronfishManager.accounts.create(name),
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

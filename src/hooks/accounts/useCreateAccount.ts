import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useCallback, useEffect } from 'react'

const useCreateAccount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<string[]>()
  const createAccount = useCallback(
    (name, mnemonicPhrase) => window.IronfishManager.accounts.create(name),
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

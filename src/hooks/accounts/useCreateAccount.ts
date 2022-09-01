import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'

const useCreateAccount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<string[]>()

  const generateMnemonic = () =>
    promiseWrapper(window.DemoDataManager.generateMnemonic())

  useEffect(() => {
    generateMnemonic()
  }, [])

  return [result, window.DemoDataManager.createAccount, generateMnemonic]
}

export default useCreateAccount

import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'
import AccountCreateParams from 'Types/AccountCreateParams'

const useCreateAccount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountCreateParams>()

  const createAccount = () =>
    promiseWrapper(window.IronfishManager.accounts.prepareAccount())

  const confirmAccountCreation = (name: string) => {
    const newAccount = { ...result.data, name }
    delete newAccount.mnemonicPhrase
    return window.IronfishManager.accounts.submitAccount(newAccount)
  }

  useEffect(() => {
    createAccount()
  }, [])

  return {
    ...result,
    actions: {
      confirmAccountCreation,
    },
  }
}

export default useCreateAccount

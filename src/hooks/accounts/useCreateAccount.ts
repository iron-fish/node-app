import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { useEffect } from 'react'
import AccountCreateParams from 'Types/AccountCreateParams'

const useCreateAccount = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<AccountCreateParams>()

  const createAccount = () =>
    promiseWrapper(window.IronfishManager.accounts.prepareAccount())

  const confirmAccountCreation = (name: string) =>
    window.IronfishManager.accounts.submitAccount({
      ...result.data,
      name,
    })

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

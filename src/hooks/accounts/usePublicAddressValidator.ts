import { useEffect } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const usePublicAddressValidator = (publicAddress: string) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<boolean>()

  const validateAddress = (address: string) =>
    promiseWrapper(
      window.IronfishManager.accounts.isValidPublicAddress(address)
    )

  useEffect(() => {
    publicAddress && validateAddress(publicAddress)
  }, [publicAddress])

  return result
}

export default usePublicAddressValidator

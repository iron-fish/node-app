import { useEffect, useState } from 'react'

const PUBLIC_ADDRESS_LENGTH = 64

const usePublicAddressValidator = (publicAddress: string) => {
  const [isValid, setValid] = useState(false)

  const validateAddress = (address: string) => {
    publicAddress && publicAddress.length === PUBLIC_ADDRESS_LENGTH
      ? window.IronfishManager.accounts
          .isValidPublicAddress(address)
          .then(setValid)
      : setValid(false)
  }

  useEffect(() => {
    validateAddress(publicAddress)
  }, [publicAddress])

  return isValid
}

export default usePublicAddressValidator

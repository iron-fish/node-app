import { useEffect, useState } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useMnemonicPhrase = (id: string, show?: boolean) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<string[]>()
  const [showPhrase, setShowPhrase] = useState<boolean>(show || false)

  const getMnemonicPhrase = () =>
    showPhrase
      ? promiseWrapper(window.IronfishManager.accounts.getMnemonicPhrase(id))
      : promiseWrapper(Promise.resolve([]))

  useEffect(() => {
    getMnemonicPhrase()
  }, [showPhrase])

  return {
    ...result,
    showPhrase,
    actions: {
      setShowPhrase,
    },
  }
}

export default useMnemonicPhrase

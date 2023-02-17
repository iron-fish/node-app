import { ConfigOptions } from '@ironfish/sdk'
import { useEffect, useCallback } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useNodeSettings = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Partial<ConfigOptions>>()

  const loadSettings = () =>
    promiseWrapper(window.IronfishManager.getNodeConfig())

  const saveSettings = useCallback(
    async (values: Partial<ConfigOptions>) =>
      promiseWrapper(
        window.IronfishManager.saveNodeConfig(values).then(() =>
          window.IronfishManager.getNodeConfig()
        )
      ),
    []
  )

  useEffect(() => {
    loadSettings()
  }, [])

  return { ...result, actions: { saveSettings } }
}

export default useNodeSettings

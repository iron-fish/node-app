import { ConfigOptions } from '@ironfish/sdk'
import { useEffect, useCallback } from 'react'
import useAsyncDataWrapper from '../useAsyncDataWrapper'

const useNodeSettings = () => {
  const [result, promiseWrapper] = useAsyncDataWrapper<Partial<ConfigOptions>>()

  const loadSettings = () =>
    promiseWrapper(window.IronfishManager.getNodeConfig())

  const saveSettings = useCallback(
    (values: Partial<ConfigOptions>) =>
      window.IronfishManager.saveNodeConfig(values).then(() => loadSettings()),

    []
  )

  useEffect(() => {
    loadSettings()
  }, [])

  return [result, saveSettings] as const
}

export default useNodeSettings

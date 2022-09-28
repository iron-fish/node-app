import { useColorMode } from '@ironfish/ui-kit'
import { FC, useEffect } from 'react'

const ElectronThemeChangeHandler: FC = () => {
  const mode = useColorMode()

  useEffect(() => {
    window.setElectronThemeMode(mode.colorMode || 'system')
  }, [mode])

  return null
}

export default ElectronThemeChangeHandler

import { UpdateStatus } from 'Types/IUpdateManager'
import {
  FC,
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from 'react'

interface UpdateContextType {
  status: UpdateStatus
  install: () => Promise<void>
  ignore: () => Promise<void>
}

const UpdateProviderContext = createContext<UpdateContextType>({
  status: {
    hasUpdates: false,
    ignoreUpdates: false,
    hasError: false,
    version: '0.0.0',
  },
  install: () => Promise.resolve(),
  ignore: () => Promise.resolve(),
})

const UpdatesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<UpdateStatus>()

  const loadUpdateStatus = () => {
    window.UpdateManager.checkUpdates().then(setStatus)
  }

  useEffect(() => {
    loadUpdateStatus()
    window.subscribeOnAppUpdateReady(setStatus)
  }, [])

  const value = {
    status,
    install: () =>
      window.UpdateManager.installUpdates().then(() => loadUpdateStatus()),
    ignore: () => window.UpdateManager.ignoreUpdates().then(setStatus),
  } satisfies UpdateContextType

  return (
    <UpdateProviderContext.Provider value={value}>
      {children}
    </UpdateProviderContext.Provider>
  )
}

function useUpdates() {
  const context = useContext(UpdateProviderContext)
  if (context === undefined) {
    throw new Error('useUpdates must be used within a UpdateProviderContext')
  }
  return context
}

export { UpdatesProvider, useUpdates }

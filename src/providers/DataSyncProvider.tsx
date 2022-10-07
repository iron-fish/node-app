import {
  FC,
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from 'react'

import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import AsyncDataProps from 'Types/AsyncDataType'

interface DataType {
  total: number
  hasMore: boolean
}

interface DataSyncContextProps extends AsyncDataProps<DataType> {
  syncData?: VoidFunction
}

const DataSyncContext = createContext<DataSyncContextProps>({
  loaded: false,
})

interface DataSyncProviderProps {
  children: ReactNode
}

const fetchData = (): Promise<DataType> =>
  new Promise(resolve => {
    setTimeout(() => resolve({ total: 10000, hasMore: true }), 5000)
  })

const DataSyncProvider: FC<DataSyncProviderProps> = ({ children }) => {
  const [result, promiseWrapper] = useAsyncDataWrapper<DataType>()

  const syncData = useCallback(() => {
    promiseWrapper(fetchData())
  }, [promiseWrapper])

  useEffect(() => {
    syncData()
  }, [])

  const value = { ...result, syncData }

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  )
}

function useDataSync() {
  const context = useContext(DataSyncContext)
  if (context === undefined) {
    throw new Error('useDataSync must be used within a DataSyncProvider')
  }
  return context
}

export { DataSyncProvider, useDataSync }

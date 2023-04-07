import useAsyncDataWrapper from 'Hooks/useAsyncDataWrapper'
import { UpdateReleaseNotesResponse } from 'Types/IUpdateManager'
import { FC, createContext, useContext, useEffect, ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import AsyncDataProps from 'Types/AsyncDataType'

const isNewVersion = (current: string, version: string) => {
  if (!current || !version) {
    return false
  }
  const [cMajor, cMinor, cPath] = current.match(/[0-9]/g).map(i => Number(i))
  const [vMajor, vMinor, vPath] = version.match(/[0-9]/g).map(i => Number(i))

  return (
    vMajor > cMajor ||
    (vMinor > cMinor && vMajor >= cMajor) ||
    (vPath > cPath && vMajor >= cMajor && vMinor >= cMinor)
  )
}

const UpdateProviderContext = createContext<
  AsyncDataProps<UpdateReleaseNotesResponse>
>({
  data: {
    data: [],
    metadata: {
      has_next: false,
      month_range: [],
    },
  },
  loaded: false,
})

const UpdateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [result, promiseWrapper] =
    useAsyncDataWrapper<UpdateReleaseNotesResponse>()

  useEffect(() => {
    promiseWrapper(
      window.UpdateManager.checkUpdates().then(status => {
        return window.UpdateManager.notes(undefined, 100).then(response => ({
          ...response,
          data: response.data.map(note => ({
            ...note,
            isNew: isNewVersion(status.version, note.version),
          })),
        }))
      })
    )
  }, [])

  const value = {
    ...result,
  } satisfies AsyncDataProps<UpdateReleaseNotesResponse>

  return (
    <UpdateProviderContext.Provider value={value}>
      {children}
    </UpdateProviderContext.Provider>
  )
}

function useUpdateProvider() {
  const context = useContext(UpdateProviderContext)
  if (context === undefined) {
    throw new Error('useUpdateProvider must be used within a useUpdateProvider')
  }
  return context
}

const UpdateWrapper = () => (
  <UpdateProvider>
    <Outlet />
  </UpdateProvider>
)

export { UpdateProvider, useUpdateProvider, UpdateWrapper }
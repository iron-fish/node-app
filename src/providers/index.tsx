import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { DataSyncProvider } from './DataSyncProvider'
import SnapshotProvider from './SnapshotProvider'
import { UpdatesProvider } from './UpdateProvider'

const Providers: FC = () => (
  <SnapshotProvider>
    <DataSyncProvider>
      <UpdatesProvider>
        <Outlet />
      </UpdatesProvider>
    </DataSyncProvider>
  </SnapshotProvider>
)

export default Providers

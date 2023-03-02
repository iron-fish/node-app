import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { DataSyncProvider } from './DataSyncProvider'
import SnapshotProvider from './SnapshotProvider'

const Providers: FC = () => (
  <DataSyncProvider>
    <SnapshotProvider>
      <Outlet />
    </SnapshotProvider>
  </DataSyncProvider>
)

export default Providers

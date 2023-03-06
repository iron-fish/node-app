import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { DataSyncProvider } from './DataSyncProvider'
import SnapshotProvider from './SnapshotProvider'

const Providers: FC = () => (
  <SnapshotProvider>
    <DataSyncProvider>
      <Outlet />
    </DataSyncProvider>
  </SnapshotProvider>
)

export default Providers

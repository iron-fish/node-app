import { FC } from 'react'
import { FlexProps } from '@ironfish/ui-kit'
import { useDataSync } from 'Providers/DataSyncProvider'
import WarningMessage from './WarningMessage'

interface SyncWarningMessageProps extends Omit<FlexProps, 'style'> {
  message?: string
}

const SyncWarningMessage: FC<SyncWarningMessageProps> = ({
  message = 'Your account balance might not be accurate while you’re syncing',
  ...rest
}) => {
  const { synced, accountsSynced } = useDataSync()

  return (
    <WarningMessage
      message={message}
      isVisible={!synced || !accountsSynced}
      {...rest}
    />
  )
}

export default SyncWarningMessage

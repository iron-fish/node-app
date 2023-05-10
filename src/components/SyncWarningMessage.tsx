import { FC } from 'react'
import { Flex, chakra, FlexProps } from '@ironfish/ui-kit'
import { useDataSync } from 'Providers/DataSyncProvider'

interface SyncWarningMessageProps extends FlexProps {
  message?: string
}

const SyncWarningMessage: FC<SyncWarningMessageProps> = ({
  message = 'Your account balance might not be accurate while you’re syncing',
  ...rest
}) => {
  const { synced, accountsSynced } = useDataSync()
  return (
    <Flex
      display={synced && accountsSynced ? 'none' : 'flex'}
      borderRadius="0.3125rem"
      bg={'#FFF9BC'}
      _dark={{
        bg: '#444123',
      }}
      height="4.3125rem"
      justifyContent="center"
      alignItems="center"
      px="1rem"
      {...rest}
    >
      <chakra.h4
        color={'#7E7400'}
        _dark={{
          color: '#FFF9BC',
        }}
      >
        {message}
      </chakra.h4>
    </Flex>
  )
}

export default SyncWarningMessage
